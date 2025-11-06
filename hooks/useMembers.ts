import { useState, useEffect } from 'react';
import { supabase } from '../components/utils/supabase';
import { Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('members_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform to Member type
      const transformedMembers: Member[] = (data || []).map(m => ({
        id: m.id,
        name: m.name,
        reimbursementAmt: 0,
        reimbursedAmt: 0,
        costs: 0,
        profits: 0,
        reimbursementHistory: [],
        debts: { owedTo: {}, owedBy: {} },
        totalOwed: 0,
        totalOwedBy: 0,
      }));

      setMembers(transformedMembers);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: { name: string }) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: memberData.name
        })
        .select()
        .single();

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchMembers();
      
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchMembers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { members, loading, error, addMember, removeMember, refetch: fetchMembers };
};
