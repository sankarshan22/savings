import { supabase } from '../components/utils/supabase';

/**
 * Migration Script: Convert dates from YYYY-MM-DD to DD/MM/YYYY
 * 
 * This script will:
 * 1. Fetch all bills from the database
 * 2. Check if dates are in old format (YYYY-MM-DD)
 * 3. Convert to new format (DD/MM/YYYY)
 * 4. Update the database
 */

const isOldFormat = (dateString: string): boolean => {
  // Check if date matches YYYY-MM-DD pattern
  const oldFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return oldFormatRegex.test(dateString);
};

const convertYYYYMMDDtoDDMMYYYY = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const migrateDateFormat = async () => {
  try {
    console.log('🚀 Starting date format migration...');
    
    // Fetch all bills
    const { data: bills, error: fetchError } = await supabase
      .from('bills')
      .select('*');

    if (fetchError) {
      throw new Error(`Error fetching bills: ${fetchError.message}`);
    }

    if (!bills || bills.length === 0) {
      console.log('✅ No bills found in database. Migration complete!');
      return;
    }

    console.log(`📊 Found ${bills.length} bills to check...`);

    // Filter bills that need migration
    const billsToMigrate = bills.filter(bill => isOldFormat(bill.date));

    if (billsToMigrate.length === 0) {
      console.log('✅ All dates are already in DD/MM/YYYY format. No migration needed!');
      return;
    }

    console.log(`🔄 Converting ${billsToMigrate.length} bills from YYYY-MM-DD to DD/MM/YYYY...`);

    // Update each bill
    let successCount = 0;
    let errorCount = 0;

    for (const bill of billsToMigrate) {
      const newDate = convertYYYYMMDDtoDDMMYYYY(bill.date);
      
      const { error: updateError } = await supabase
        .from('bills')
        .update({ date: newDate })
        .eq('id', bill.id);

      if (updateError) {
        console.error(`❌ Error updating bill ${bill.id}:`, updateError.message);
        errorCount++;
      } else {
        console.log(`✓ Migrated: ${bill.date} → ${newDate} (Bill ID: ${bill.id})`);
        successCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount} bills`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} bills`);
    }
    console.log('\n🎉 Date format migration complete!');

  } catch (error: any) {
    console.error('💥 Migration failed:', error.message);
    throw error;
  }
};

// Run migration
migrateDateFormat()
  .then(() => {
    console.log('✨ Migration script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💀 Migration script failed:', error);
    process.exit(1);
  });
