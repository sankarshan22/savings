import { useState, useEffect } from 'react';
import { supabase } from '../components/utils/supabase';
import { Settlement } from '../types';

export const useSettlements = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettlements();

    // Real-time subscription
    const subscription = supabase
      .channel('settlements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settlements'
        },
        () => {
          fetchSettlements();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSettlements = async () => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform to Settlement type
      const transformedSettlements: Settlement[] = (data || []).map(s => ({
        id: s.id,
        date: s.date,
        fromMemberId: s.from_member_id,
        toMemberId: s.to_member_id,
        amount: parseFloat(s.amount)
      }));

      setSettlements(transformedSettlements);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching settlements:', err);
    } finally {
      setLoading(false);
    }
  };

  const addSettlement = async (settlementData: Omit<Settlement, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('settlements')
        .insert({
          date: settlementData.date,
          from_member_id: settlementData.fromMemberId,
          to_member_id: settlementData.toMemberId,
          amount: settlementData.amount
        })
        .select()
        .single();

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchSettlements();
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeSettlement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('settlements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchSettlements();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    settlements, 
    loading, 
    error, 
    addSettlement, 
    removeSettlement,
    refetch: fetchSettlements 
  };
};
