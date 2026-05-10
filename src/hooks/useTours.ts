import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export interface Tour {
  id: string;
  name: string;
  description: string;
  url: string;
  created_at?: string;
}

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        throw new Error(err.message);
      }
      
      setTours(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const addTour = async (tour: Omit<Tour, 'id' | 'created_at'>) => {
    try {
      setError(null);
      const { data, error: err } = await supabase
        .from('tours')
        .insert([tour])
        .select()
        .single();
        
      if (err) {
        throw new Error(err.message);
      }
      
      setTours((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      setError(err.message || 'Failed to add tour');
      console.error(err);
      return { data: null, error: err };
    }
  };

  return { tours, loading, error, fetchTours, addTour };
}
