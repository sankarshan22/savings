import React, { useState } from 'react';
import { Member } from '../types';
import Button from './Button';
import { formatCurrency } from './utils/currency';
import MemberAvatar from './MemberAvatar';

interface SettleDebtFormProps {
  creditor: Member; // Person receiving money
  debtor: Member;   // Person paying money
  maxAmount: number;
  onSettle: (amount: number, date: string) => void;
  onClose: () => void;
}

const SettleDebtForm: React.FC<SettleDebtFormProps> = ({ creditor, debtor, maxAmount, onSettle, onClose }) => {
  const [amount, setAmount] = useState<number | ''>(Number(maxAmount.toFixed(2)));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === '' || amount <= 0 || amount > maxAmount) {
      setError(`Please enter a valid amount up to ${formatCurrency(maxAmount)}.`);
      return;
    }
    setError('');
    onSettle(amount, date);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <h2 className="text-2xl font-bold text-white text-center">Record Payment</h2>
      
      <div className="flex items-center justify-center gap-4 text-center">
          <div className="flex flex-col items-center">
              <MemberAvatar name={debtor.name} className="w-12 h-12" />
              <p className="text-sm text-[#D9D9D9] mt-1">{debtor.name} pays</p>
          </div>
          <span className="text-2xl font-semibold text-[#00C2A8]">→</span>
          <div className="flex flex-col items-center">
              <MemberAvatar name={creditor.name} className="w-12 h-12" />
              <p className="text-sm text-[#D9D9D9] mt-1">{creditor.name}</p>
          </div>
      </div>
      
      {error && <p className="text-[#FF6B81] bg-[#FF6B81]/10 p-3 rounded-md text-center">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-[#F2F2F2]">Amount Received</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
              placeholder={`e.g. ${maxAmount.toFixed(2)}`}
              step="0.01"
              max={maxAmount}
            />
            <p className="text-xs text-[#B0B0B0] mt-1">
                Max: {formatCurrency(maxAmount)}
            </p>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-[#F2F2F2]">Date of Payment</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
            />
          </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-[#2E2E2E]">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-[#3C3C3C] text-white font-semibold rounded-lg hover:bg-[#5A5A5A] transition-colors">
            Cancel
        </button>
        <Button type="submit">Confirm Payment</Button>
      </div>
    </form>
  );
};

export default SettleDebtForm;
