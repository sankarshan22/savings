
import React from 'react';
import { Bill, Member } from '../types';
import { formatCurrency } from './utils/currency';
import MemberAvatar from './MemberAvatar';

interface BillDetailsProps {
  bill: Bill;
  members: Member[];
}

const BillDetails: React.FC<BillDetailsProps> = ({ bill, members }) => {

  const getMembersFromIds = (ids: string[]): Member[] => {
    return ids.map(id => members.find(m => m.id === id)).filter((m): m is Member => !!m);
  };

  const costSharers = getMembersFromIds(bill.amountSharedBy);
  const payer = members.find(m => m.id === bill.paidBy);

  return (
    <div className="p-2 space-y-6">
      <div>
        <p className="text-sm text-[#D9D9D9]">{bill.date}</p>
        <h3 className="text-2xl font-bold text-[#FFFFFF]">{bill.from} → {bill.to}</h3>
        <p className="text-[#F2F2F2] mt-1">{bill.reason}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center bg-[#2E2E2E]/50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-[#D9D9D9]">Cost</p>
          <p className="text-xl font-semibold text-[#FF6B81]">{formatCurrency(bill.amount)}</p>
        </div>
        <div>
          <p className="text-sm text-[#D9D9D9]">Profit</p>
          <p className="text-xl font-semibold text-[#A8E6CF]">{formatCurrency(bill.profit)}</p>
        </div>
        <div>
          <p className="text-sm text-[#D9D9D9]">Total</p>
          <p className="text-xl font-semibold text-[#FFFFFF]">{formatCurrency(bill.amount + bill.profit)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-[#F2F2F2] mb-3">Shared With</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {costSharers.length > 0 ? (
                costSharers.map(member => (
                    <div key={member.id} className="flex items-center gap-3 bg-[#121212]/50 p-2 rounded-md">
                        <MemberAvatar name={member.name} className="w-8 h-8" />
                        <span className="text-sm text-[#F2F2F2]">{member.name}</span>
                    </div>
                ))
            ) : <p className="text-xs text-[#B0B0B0] italic">Nobody</p>}
          </div>
        </div>
        {payer && (
          <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-3">Paid By</h4>
            <div className="flex items-center gap-3 bg-[#121212]/50 p-3 rounded-md">
              <MemberAvatar name={payer.name} className="w-10 h-10" />
              <span className="text-base text-[#F2F2F2] font-medium">{payer.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillDetails;