import { supabase } from "@/integrations/supabase/client";

/**
 * Debug and test Supabase storage access
 */
export async function debugStorageAccess() {
  console.log('🔍 [DEBUG] Testing Supabase storage access...');
  
  try {
    // Test 1: List files in pictures bucket
    console.log('📁 [DEBUG] Attempting to list files in pictures bucket...');
    const { data: listData, error: listError } = await supabase.storage
      .from('pictures')
      .list('', {
        limit: 10,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ [DEBUG] List error:', listError);
      return { success: false, error: listError };
    }
    
    console.log('✅ [DEBUG] List success:', listData?.length || 0, 'files found');
    console.log('📋 [DEBUG] First few files:', listData?.slice(0, 5).map(f => f.name));
    
    // Test 2: Try to get a public URL for a file (if any exist)
    if (listData && listData.length > 0) {
      const firstFile = listData[0].name;
      console.log('🔗 [DEBUG] Testing public URL for:', firstFile);
      
      const { data: urlData } = supabase.storage
        .from('pictures')
        .getPublicUrl(firstFile);
      
      console.log('🌐 [DEBUG] Public URL generated:', urlData.publicUrl);
      
      // Test 3: Try to fetch the image to see if it's accessible
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
        console.log('📡 [DEBUG] Image fetch status:', response.status, response.statusText);
      } catch (fetchError) {
        console.error('❌ [DEBUG] Image fetch failed:', fetchError);
      }
    }
    
    return { success: true, files: listData };
    
  } catch (error) {
    console.error('💥 [DEBUG] Storage access failed:', error);
    return { success: false, error };
  }
}

// Auto-run debug on import
debugStorageAccess();