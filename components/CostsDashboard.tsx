
import React, { useMemo } from 'react';
import { Bill, Member } from '../types';
import { ChevronLeftIcon, ArrowTrendingDownIcon } from './icons/Icons';
import { formatCurrency } from '../utils/currency';
import MemberAvatarList from './MemberAvatarList';
import MemberAvatar from './MemberAvatar';

interface CostsDashboardProps {
  onBack: () => void;
  bills: Bill[];
  members: Member[];
}

const CostsDashboard: React.FC<CostsDashboardProps> = ({ onBack, bills, members }) => {
  const costsByDate = useMemo(() => {
    const dateMap: Record<string, { totalCost: number; involvedMemberIds: string[] }> = {};
    bills.forEach(bill => {
      if (bill.amount > 0) {
        if (!dateMap[bill.date]) {
          dateMap[bill.date] = { totalCost: 0, involvedMemberIds: [] };
        }
        dateMap[bill.date].totalCost += bill.amount;
        dateMap[bill.date].involvedMemberIds.push(...bill.amountSharedBy);
      }
    });

    // Make member IDs unique for each date
    Object.values(dateMap).forEach(data => {
        data.involvedMemberIds = [...new Set(data.involvedMemberIds)];
    });

    return dateMap;
  }, [bills]);

  const sortedDates = useMemo(() => {
    return Object.keys(costsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [costsByDate]);

  const totalCost = useMemo(() => {
    return bills.reduce((sum, bill) => sum + bill.amount, 0);
  }, [bills]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-[#1C1C1C] text-[#D9D9D9] hover:bg-[#2E2E2E] hover:text-[#F2F2F2] transition-colors"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-[#F2F2F2] flex items-center">
            <ArrowTrendingDownIcon className="w-6 h-6 mr-2 text-[#FF6B81]"/>
            Costs Dashboard
          </h2>
        </div>
      </div>

      {/* Combined Top Section: Totals */}
      <div className="bg-[#1C1C1C] rounded-lg p-6 shadow-lg flex flex-col md:flex-row gap-8 mb-12">
          {/* Total Cost Section (Left) */}
          <div className="flex flex-col items-center justify-center text-center md:w-1/4 md:border-r md:border-[#2E2E2E] md:pr-8">
              <p className="text-lg text-[#D9D9D9]">Total Costs</p>
              <p className="text-5xl font-bold text-[#FF6B81] mt-2">{formatCurrency(totalCost)}</p>
          </div>

          {/* Member Costs Section (Right) */}
          <div className="md:w-3/4 flex-grow">
              <h3 className="text-xl font-semibold text-[#F2F2F2] mb-4 text-center md:text-left">Member Cost Share</h3>
              {members.some(m => m.costs > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                      {members
                          .filter(m => m.costs > 0)
                          .sort((a,b) => b.costs - a.costs)
                          .map(member => (
                              <div key={member.id} className="text-center flex flex-col items-center">
                                  <MemberAvatar name={member.name} className="w-12 h-12 mx-auto mb-2 border-2 border-[#2E2E2E]"/>
                                  <p className="text-sm font-semibold text-[#F2F2F2] truncate w-full">{member.name}</p>
                                  <p className="text-sm font-mono text-[#FF6B81]">{formatCurrency(member.costs)}</p>
                              </div>
                          ))
                      }
                  </div>
              ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-[#B0B0B0] text-center py-8">No members with costs.</p>
                  </div>
              )}
          </div>
      </div>


      {/* Bottom Section: Daily Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#F2F2F2] px-2">Daily Breakdown</h3>
        {sortedDates.length > 0 ? (
          <div className="bg-[#1C1C1C] rounded-lg p-6 shadow-lg space-y-4">
              {sortedDates.map(date => {
                  const { totalCost: dailyCost, involvedMemberIds } = costsByDate[date];
                  const involvedMembers = members.filter(m => involvedMemberIds.includes(m.id));
                  
                  return (
                      <div key={date} className="bg-[#121212]/50 rounded-lg p-4 transition-all duration-300 hover:bg-[#2E2E2E]/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-[#F2F2F2]">{formatDate(date)}</span>
                          <span className="font-mono font-semibold text-[#FF6B81]">{formatCurrency(dailyCost)}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#D9D9D9] mb-2">Members Involved</h4>
                          <MemberAvatarList members={involvedMembers} />
                        </div>
                      </div>
                  );
              })}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-[#1C1C1C] rounded-lg">
            <ArrowTrendingDownIcon className="w-16 h-16 mx-auto text-[#7A7A7A] mb-4"/>
            <h3 className="text-xl font-semibold text-[#F2F2F2]">No Costs Recorded</h3>
            <p className="text-[#D9D9D9] mt-2">Costs from bills will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostsDashboard;
