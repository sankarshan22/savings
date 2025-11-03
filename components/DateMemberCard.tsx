
import React from 'react';
import { Member } from '../types';
import { formatCurrency } from '../utils/currency';
import MemberAvatar from './MemberAvatar';

interface DateMemberCardProps {
  member: Member;
  dateCost: number;
  dateProfit: number;
  onSelect: (id: string) => void;
}

const DateMemberCard: React.FC<DateMemberCardProps> = ({ member, dateCost, dateProfit, onSelect }) => {
  return (
    <div 
      className="bg-[#1C1C1C] rounded-lg shadow-md p-4 flex flex-col items-center text-center transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-[#2E2E2E]/50 hover:shadow-[#00C2A8]/10"
      onClick={() => onSelect(member.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(member.id)}
      aria-label={`View bills for ${member.name}`}
    >
      <MemberAvatar
        name={member.name}
        className="w-16 h-16 border-2 border-[#3C3C3C] mb-3"
      />
      <h3 className="text-lg font-bold text-white">{member.name}</h3>
      
      <div className="w-full mt-3 pt-3 border-t border-[#2E2E2E]/50 flex justify-around">
        <div className="text-center">
            <p className="text-xs text-[#D9D9D9]">Date Cost</p>
            <p className="font-semibold text-base text-[#FF6B81]">{formatCurrency(dateCost)}</p>
        </div>
        <div className="text-center">
            <p className="text-xs text-[#D9D9D9]">Date Profit</p>
            <p className="font-semibold text-base text-[#A8E6CF]">{formatCurrency(dateProfit)}</p>
        </div>
      </div>
    </div>
  );
};

export default DateMemberCard;