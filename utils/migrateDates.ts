import { supabase } from '../components/utils/supabase';

/**
 * Browser-friendly migration utility
 * Run this in your browser console or add a button to trigger it
 */

export const migrateDatabaseDates = async (): Promise<{
  success: boolean;
  migrated: number;
  errors: number;
  message: string;
}> => {
  try {
    console.log('🚀 Starting date format migration...');
    
    // Fetch all bills
    const { data: bills, error: fetchError } = await supabase
      .from('bills')
      .select('*');

    if (fetchError) {
      return {
        success: false,
        migrated: 0,
        errors: 1,
        message: `Error fetching bills: ${fetchError.message}`
      };
    }

    if (!bills || bills.length === 0) {
      return {
        success: true,
        migrated: 0,
        errors: 0,
        message: 'No bills found in database'
      };
    }

    // Check if date is in old YYYY-MM-DD format
    const isOldFormat = (dateString: string): boolean => {
      return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    };

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const convertDate = (dateString: string): string => {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    };

    // Filter bills that need migration
    const billsToMigrate = bills.filter((bill: any) => isOldFormat(bill.date));

    if (billsToMigrate.length === 0) {
      return {
        success: true,
        migrated: 0,
        errors: 0,
        message: 'All dates are already in DD/MM/YYYY format'
      };
    }

    console.log(`🔄 Converting ${billsToMigrate.length} bills...`);

    // Update each bill
    let successCount = 0;
    let errorCount = 0;

    for (const bill of billsToMigrate) {
      const newDate = convertDate(bill.date);
      
      const { error: updateError } = await supabase
        .from('bills')
        .update({ date: newDate })
        .eq('id', bill.id);

      if (updateError) {
        console.error(`❌ Error updating bill ${bill.id}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✓ ${bill.date} → ${newDate}`);
        successCount++;
      }
    }

    return {
      success: errorCount === 0,
      migrated: successCount,
      errors: errorCount,
      message: `Successfully migrated ${successCount} bills${errorCount > 0 ? `, ${errorCount} errors` : ''}`
    };

  } catch (error: any) {
    return {
      success: false,
      migrated: 0,
      errors: 1,
      message: `Migration failed: ${error.message}`
    };
  }
};

// For direct browser console usage:
// window.migrateDatabaseDates = migrateDatabaseDates;
