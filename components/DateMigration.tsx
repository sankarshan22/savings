import React, { useState } from 'react';
import { migrateDatabaseDates } from '../utils/migrateDates';
import Button from './Button';

const DateMigration: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigrate = async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);

    try {
      const migrationResult = await migrateDatabaseDates();
      
      if (migrationResult.success) {
        setResult(
          `✅ ${migrationResult.message}\n\n` +
          `📊 Migrated: ${migrationResult.migrated} bills\n` +
          `${migrationResult.errors > 0 ? `❌ Errors: ${migrationResult.errors}` : ''}`
        );
      } else {
        setError(migrationResult.message);
      }
    } catch (err: any) {
      setError(`Migration failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2E2E2E] rounded-xl p-6 shadow-lg border border-[#3C3C3C]">
      <h3 className="text-xl font-bold text-[#F2F2F2] mb-2">
        🔄 Date Format Migration
      </h3>
      <p className="text-sm text-[#B0B0B0] mb-4">
        Convert existing dates from YYYY-MM-DD to DD/MM/YYYY format.
        <br />
        <span className="text-[#808080] text-xs">
          (Run this once if you have existing bills in the old format)
        </span>
      </p>
      
      <Button
        onClick={handleMigrate}
        disabled={isRunning}
        className="w-full sm:w-auto"
      >
        {isRunning ? '⏳ Migrating...' : '🚀 Run Migration'}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-[#2A4A2A] border border-[#4A8A4A] rounded-lg">
          <pre className="text-sm text-[#A8E6CF] whitespace-pre-wrap font-mono">
            {result}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-[#4A2A2A] border border-[#8A4A4A] rounded-lg">
          <p className="text-sm text-[#FF6B81] font-mono">
            ❌ {error}
          </p>
        </div>
      )}

      {!result && !error && (
        <div className="mt-4 p-3 bg-[#2A2A3A] border border-[#4A4A5A] rounded-lg">
          <p className="text-xs text-[#B0B0B0]">
            ℹ️ This migration will:
          </p>
          <ul className="text-xs text-[#D9D9D9] mt-2 space-y-1 ml-4 list-disc">
            <li>Find all bills with dates in YYYY-MM-DD format</li>
            <li>Convert them to DD/MM/YYYY format</li>
            <li>Update the database automatically</li>
            <li>Show you a summary of changes made</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DateMigration;
