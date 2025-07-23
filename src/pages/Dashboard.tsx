
import React from 'react';
import ImageCacheManager from '@/components/ImageCacheManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-barrush-midnight to-barrush-slate flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col flex-1 min-h-screen pt-20">
        <div className="rounded-xl bg-black/60 p-10 shadow-xl border border-barrush-steel/30 text-barrush-platinum w-full mt-12">
          <h1 className="text-4xl font-bold font-serif mb-6 text-rose-600">Admin Dashboard</h1>
          
          <Tabs defaultValue="cache" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cache">Image Management</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cache" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageCacheManager />
                <div className="text-barrush-platinum/80 space-y-4">
                  <h3 className="text-lg font-semibold">Image Management</h3>
                  <p className="text-sm">
                    Use the Image Cache Manager to refresh the connection to Supabase storage and ensure all product images are properly loaded.
                  </p>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Clears local image cache</li>
                    <li>Reloads images from Supabase storage</li>
                    <li>Improves image matching for products</li>
                    <li>Fixes missing product images</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4 mt-6">
              <div className="text-barrush-platinum/80">
                <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
                <p>Statistics and analytics will be displayed here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
