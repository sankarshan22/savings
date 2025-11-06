
// FIX: Implemented the BillCard component which was previously missing.
import React from 'react';
import { Bill, Member } from '../types';
import { formatCurrency } from './utils/currency';
import MemberAvatarList from './MemberAvatarList';
import { TrashIcon, PencilIcon } from './icons/Icons';
import MemberAvatar from './MemberAvatar';

interface BillCardProps {
  bill: Bill;
  members: Member[];
  onRemove: (id: string) => void;
  onEdit: (bill: Bill) => void;
  onSelect: (id: string) => void;
  canBeDeleted: boolean;
}

const BillCard: React.FC<BillCardProps> = ({ bill, members, onRemove, onEdit, onSelect, canBeDeleted }) => {
    
  const getMembersFromIds = (ids: string[]): Member[] => {
    return ids.map(id => members.find(m => m.id === id)).filter((m): m is Member => !!m);
  };

  const costSharers = getMembersFromIds(bill.amountSharedBy);
  const payer = members.find(m => m.id === bill.paidBy);
  
  return (
    <div 
      className="bg-[#1C1C1C] rounded-lg shadow-lg p-5 group relative transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[#4F8CFF]/20 cursor-pointer"
      onClick={() => onSelect(bill.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(bill.id)}
      aria-label={`View details for bill from ${bill.from}`}
    >
      <div className="absolute top-0 right-0 p-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
         <button
           onClick={(e) => {
             e.stopPropagation();
             onEdit(bill);
           }}
           className="p-2 rounded-full bg-[#4F8CFF]/20 text-[#4F8CFF] hover:bg-[#4F8CFF]/40 hover:text-[#8cb3ff] transition-colors"
           aria-label={`Edit bill from ${bill.from}`}
         >
           <PencilIcon className="w-5 h-5" />
         </button>
         {canBeDeleted && (
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // prevent card click event
                    onRemove(bill.id);
                }} 
                className="p-2 rounded-full bg-[#FF6B81]/20 text-[#FF6B81] hover:bg-[#FF6B81]/40 hover:text-[#ff8a9a] transition-colors"
                aria-label={`Remove bill from ${bill.from}`}
            >
                <TrashIcon className="w-5 h-5" />
            </button>
         )}
       </div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#D9D9D9]">{bill.date}</p>
          <h3 className="text-xl font-bold text-[#FFFFFF]">{bill.from} → {bill.to}</h3>
          <p className="text-sm text-[#F2F2F2] mt-1">{bill.reason}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
            <p className="font-semibold text-lg text-[#FF6B81]">{formatCurrency(bill.amount)}</p>
            <p className="text-xs text-[#D9D9D9]">Cost</p>
            <p className="font-semibold text-lg text-[#A8E6CF] mt-1">{formatCurrency(bill.profit)}</p>
            <p className="text-xs text-[#D9D9D9]">Profit</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#2E2E2E]/50 flex justify-between items-end">
        <div>
            <h4 className="text-sm font-semibold text-[#D9D9D9] mb-2">Shared With</h4>
            <MemberAvatarList members={costSharers} />
        </div>
        {payer && (
            <div className="text-right">
                <h4 className="text-sm font-semibold text-[#D9D9D9] mb-2">Paid By</h4>
                <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-medium text-[#F2F2F2]">{payer.name}</span>
                    <MemberAvatar name={payer.name} className="h-8 w-8 ring-2 ring-[#121212]" />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BillCard;
