import { useState, useEffect } from 'react';
import { supabase } from '../components/utils/supabase';
import { DatePaymentStatus } from '../App';

export const useDatePaymentStatus = () => {
  const [datePaymentStatus, setDatePaymentStatus] = useState<Record<string, DatePaymentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDatePaymentStatus();

    // Real-time subscription
    const subscription = supabase
      .channel('date_payment_status_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'date_payment_status'
        },
        () => {
          fetchDatePaymentStatus();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDatePaymentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('date_payment_status')
        .select('*');

      if (error) throw error;

      // Transform to Record<string, DatePaymentStatus>
      const statusMap: Record<string, DatePaymentStatus> = {};
      (data || []).forEach((item: any) => {
        statusMap[item.date] = item.status as DatePaymentStatus;
      });

      setDatePaymentStatus(statusMap);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching date payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDateStatus = async (date: string, status: DatePaymentStatus) => {
    try {
      const { error } = await supabase
        .from('date_payment_status')
        .upsert({
          date,
          status
        }, {
          onConflict: 'date'
        });

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchDatePaymentStatus();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeDateStatus = async (date: string) => {
    try {
      const { error } = await supabase
        .from('date_payment_status')
        .delete()
        .eq('date', date);

      if (error) throw error;
      
      // Immediately refetch to update the UI
      await fetchDatePaymentStatus();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    datePaymentStatus, 
    loading, 
    error, 
    updateDateStatus,
    removeDateStatus,
    refetch: fetchDatePaymentStatus 
  };
};
