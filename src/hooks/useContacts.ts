import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Contact {
  id: number;
  Name: string;
  'Phone Number_1': string | null;
  'Job Description': string | null;
}

export function useContacts() {
  const [riders, setRiders] = useState<Contact[]>([]);
  const [distributors, setDistributors] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from('Contacts')
          .select('id, Name, "Phone Number_1", "Job Description"')
          .not('Job Description', 'is', null);

        if (error) throw error;

        const ridersList = data?.filter(contact => 
          contact['Job Description']?.toLowerCase().includes('rider')
        ) || [];
        
        const distributorsList = data?.filter(contact => 
          contact['Job Description']?.toLowerCase().includes('distributor')
        ) || [];

        setRiders(ridersList);
        setDistributors(distributorsList);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { riders, distributors, loading };
}