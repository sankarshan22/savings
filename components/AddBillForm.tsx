
import React, { useState, useMemo, useEffect } from 'react';
import { Bill, Member } from '../types';
import Button from './Button';
import { formatCurrency } from '../utils/currency';

interface AddBillFormProps {
  onSave: (bill: Bill | Omit<Bill, 'id'>) => void;
  onClose: () => void;
  members: Member[];
  initialBill?: Bill | null;
}

const AddBillForm: React.FC<AddBillFormProps> = ({ onSave, onClose, members, initialBill }) => {
  const [error, setError] = useState('');
  
  const isEditing = !!initialBill;

  // Form State
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [profit, setProfit] = useState<number | ''>('');
  const [amountSharedBy, setAmountSharedBy] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState<string>('');

  useEffect(() => {
    if (initialBill) {
      setFrom(initialBill.from);
      setTo(initialBill.to);
      setDate(initialBill.date);
      setReason(initialBill.reason);
      setAmount(initialBill.amount);
      setProfit(initialBill.profit);
      setAmountSharedBy(initialBill.amountSharedBy);
      setPaidBy(initialBill.paidBy);
    }
  }, [initialBill]);

  useEffect(() => {
    if (amountSharedBy.length === 1) {
        setPaidBy(amountSharedBy[0]);
    }
  }, [amountSharedBy]);
  
  const totalAmount = useMemo(() => {
    const cost = typeof amount === 'number' ? amount : 0;
    const prof = typeof profit === 'number' ? profit : 0;
    return cost + prof;
  }, [amount, profit]);
  
  const handleValidation = () => {
      if (!from || !to || !reason || !date) {
          setError('Please fill in all required fields: From, To, Date, and Reason.');
          return false;
      }
      if (amount === '' || profit === '' || amount < 0 || profit < 0) {
          setError('Please enter valid, non-negative numbers for cost and profit.');
          return false;
      }
      if (amountSharedBy.length === 0) {
          setError('At least one member must share the cost.');
          return false;
      }
      if (!paidBy) {
          setError('Please select who paid the bill.');
          return false;
      }
      setError('');
      return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidation()) return;
    
    const billData = {
      date,
      from,
      to,
      reason,
      amount: Number(amount),
      profit: Number(profit),
      amountSharedBy,
      paidBy,
    };
    
    if (isEditing) {
      onSave({ ...billData, id: initialBill.id });
    } else {
      onSave(billData);
    }
  };
  
  const handleCheckboxChange = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setList(prev => prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <h2 className="text-2xl font-bold text-white text-center">{isEditing ? 'Edit Bill' : 'Add New Bill'}</h2>
        {error && <p className="text-[#FF6B81] bg-[#FF6B81]/10 p-3 rounded-md text-center">{error}</p>}
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* From */}
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-[#F2F2F2]">From</label>
              <input type="text" id="from" value={from} onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                placeholder="e.g. Cloud Services Inc."
              />
            </div>
             {/* To */}
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-[#F2F2F2]">To</label>
              <input type="text" id="to" value={to} onChange={(e) => setTo(e.target.value)}
                className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                placeholder="e.g. Our Company"
              />
            </div>
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#F2F2F2]">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
              />
            </div>
            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-[#F2F2F2]">Reason</label>
              <input type="text" id="reason" value={reason} onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                placeholder="e.g. Monthly server hosting"
              />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-[#2E2E2E]">
            {/* Amount */}
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-[#F2F2F2]">Amount (Cost)</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                    placeholder="e.g. 450"
                />
            </div>
            {/* Profit */}
            <div>
                <label htmlFor="profit" className="block text-sm font-medium text-[#F2F2F2]">Profit</label>
                <input type="number" id="profit" value={profit} onChange={(e) => setProfit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                    placeholder="e.g. 150"
                />
            </div>
            {/* Paid By */}
            <div>
              <label htmlFor="paidBy" className="block text-sm font-medium text-[#F2F2F2]">Paid By</label>
              <select 
                id="paidBy" 
                value={paidBy} 
                onChange={(e) => setPaidBy(e.target.value)}
                disabled={amountSharedBy.length === 1}
                className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm disabled:bg-[#3C3C3C]/50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select a member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
        </div>

        {/* Sharing Details */}
        <fieldset className="border-t border-[#2E2E2E] pt-5">
            <legend className="text-lg font-semibold text-[#F2F2F2] px-2 -ml-2">Sharing Details</legend>
            <div className="mt-4">
                {/* Amount Shared By */}
                <div>
                    <h4 className="font-medium text-[#F2F2F2] mb-2">Shared With</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-[#121212]/50 rounded-md">
                        {members.map(member => (
                            <label key={member.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-[#2E2E2E]/50 transition-colors">
                                <input type="checkbox"
                                    checked={amountSharedBy.includes(member.id)}
                                    onChange={() => handleCheckboxChange(amountSharedBy, setAmountSharedBy, member.id)}
                                    className="h-4 w-4 rounded border-[#5A5A5A] text-[#00C2A8] focus:ring-[#00C2A8] focus:ring-offset-[#1C1C1C] bg-[#2E2E2E]"
                                />
                                <span className="text-[#F2F2F2]">{member.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </fieldset>

        {/* Total and Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[#2E2E2E]">
            <div className="text-left">
                <p className="text-[#D9D9D9] text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-[#3C3C3C] text-white font-semibold rounded-lg hover:bg-[#5A5A5A] transition-colors">
                    Cancel
                </button>
                <Button type="submit">{isEditing ? 'Save Changes' : 'Add Bill'}</Button>
            </div>
        </div>
    </form>
  );
};

export default AddBillForm;