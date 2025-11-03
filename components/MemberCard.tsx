
import React from 'react';
import { Member } from '../types';
import { TrashIcon } from './icons/Icons';
import { formatCurrency } from '../utils/currency';
import MemberAvatar from './MemberAvatar';

interface MemberCardProps {
  member: Member;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onRemove, onSelect }) => {
  return (
    <div 
        className="bg-[#1C1C1C] rounded-lg shadow-lg p-5 flex flex-col justify-between group relative transform transition-all duration-300 hover:scale-105 hover:shadow-[#00C2A8]/20 cursor-pointer"
        onClick={() => onSelect(member.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(member.id)}
        aria-label={`View details for ${member.name}`}
    >
       <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
         <button 
           onClick={(e) => {
             e.stopPropagation(); // prevent card click event
             onRemove(member.id);
           }} 
           className="p-2 rounded-full bg-[#FF6B81]/20 text-[#FF6B81] hover:bg-[#FF6B81]/40 hover:text-[#ff8a9a] transition-colors"
           aria-label={`Remove ${member.name}`}
         >
           <TrashIcon className="w-5 h-5" />
         </button>
       </div>

      <div className="flex flex-col items-center text-center w-full">
        <MemberAvatar
            name={member.name}
            className="w-24 h-24 border-4 border-[#2E2E2E] group-hover:border-[#00C2A8] transition-colors duration-300 mb-4"
        />
        <h3 className="text-xl font-bold text-[#FFFFFF]">{member.name}</h3>
      </div>
      
      <div className="w-full mt-4 pt-4 border-t border-[#2E2E2E]/50 flex justify-around">
        <div className="text-center">
            <p className="text-sm text-[#D9D9D9]">Costs</p>
            <p className="font-semibold text-lg text-[#FF6B81]">{formatCurrency(member.costs)}</p>
        </div>
        <div className="text-center">
            <p className="text-sm text-[#D9D9D9]">Owed</p>
            <p className="font-semibold text-lg text-[#FFC857]">{formatCurrency(member.totalOwed)}</p>
        </div>
        <div className="text-center">
            <p className="text-sm text-[#D9D9D9]">Profits</p>
            <p className="font-semibold text-lg text-[#A8E6CF]">{formatCurrency(member.profits)}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
