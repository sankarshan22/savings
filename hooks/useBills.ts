import { useState, useEffect } from 'react';
import { supabase } from '../components/utils/supabase';
import { Bill } from '../types';

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();

    // Real-time subscription
    const subscription = supabase
      .channel('bills_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bills'
        },
        () => {
          fetchBills();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBills = async () => {
    try {
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select('*')
        .order('date', { ascending: false });

      if (billsError) throw billsError;

      // Transform data to match Bill interface
      const transformedBills: Bill[] = (billsData || []).map((bill: any) => ({
        id: bill.id,
        date: bill.date,
        from: bill.from,
        to: bill.to,
        reason: bill.reason,
        amount: parseFloat(bill.amount),
        profit: parseFloat(bill.profit),
        paidBy: bill.paid_by,
        amountSharedBy: bill.amount_shared_by || []
      }));

      setBills(transformedBills);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBill = async (billData: Omit<Bill, 'id'>) => {
    try {
      // Insert bill
      const { data: newBill, error: billError } = await supabase
        .from('bills')
        .insert({
          date: billData.date,
          from: billData.from,
          to: billData.to,
          reason: billData.reason,
          amount: billData.amount,
          profit: billData.profit,
          paid_by: billData.paidBy,
          amount_shared_by: billData.amountSharedBy
        })
        .select()
        .single();

      if (billError) throw billError;

      // Immediately refetch to update the UI
      await fetchBills();

      return newBill;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateBill = async (billData: Bill) => {
    try {
      // Update bill
      const { error: billError } = await supabase
        .from('bills')
        .update({
          date: billData.date,
          from: billData.from,
          to: billData.to,
          reason: billData.reason,
          amount: billData.amount,
          profit: billData.profit,
          paid_by: billData.paidBy,
          amount_shared_by: billData.amountSharedBy
        })
        .eq('id', billData.id);

      if (billError) throw billError;
      
      // Immediately refetch to update the UI
      await fetchBills();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeBill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchBills();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeBillsByDate = async (date: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('date', date);

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchBills();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    bills, 
    loading, 
    error, 
    addBill, 
    updateBill,
    removeBill, 
    removeBillsByDate,
    refetch: fetchBills 
  };
};
