
import React, { useMemo } from 'react';
import { Bill, Member } from '../types';
import { ChevronLeftIcon, ArrowTrendingUpIcon } from './icons/Icons';
import { formatCurrency } from './utils/currency';
import MemberAvatarList from './MemberAvatarList';
import MemberAvatar from './MemberAvatar';

interface ProfitsDashboardProps {
  onBack: () => void;
  bills: Bill[];
  members: Member[];
}

const ProfitsDashboard: React.FC<ProfitsDashboardProps> = ({ onBack, bills, members }) => {
  const profitsByDate = useMemo(() => {
    const dateMap: Record<string, { totalProfit: number; involvedMemberIds: string[] }> = {};
    bills.forEach(bill => {
      if (bill.profit > 0) {
        if (!dateMap[bill.date]) {
          dateMap[bill.date] = { totalProfit: 0, involvedMemberIds: [] };
        }
        const dateData = dateMap[bill.date];
        if (dateData) {
          dateData.totalProfit += bill.profit;
          dateData.involvedMemberIds.push(...bill.amountSharedBy);
        }
      }
    });

    // Make member IDs unique for each date
    Object.values(dateMap).forEach(data => {
        data.involvedMemberIds = [...new Set(data.involvedMemberIds)];
    });

    return dateMap;
  }, [bills]);

  const sortedDates = useMemo(() => {
    return Object.keys(profitsByDate).sort((a, b) => {
      // Convert DD/MM/YYYY to Date for comparison
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      const dateA = new Date(yearA ?? 0, (monthA ?? 1) - 1, dayA ?? 1);
      const dateB = new Date(yearB ?? 0, (monthB ?? 1) - 1, dayB ?? 1);
      return dateB.getTime() - dateA.getTime();
    });
  }, [profitsByDate]);

  const totalProfit = useMemo(() => {
    return bills.reduce((sum, bill) => sum + bill.profit, 0);
  }, [bills]);

  const formatDate = (dateString: string) => {
    // Parse DD/MM/YYYY format
    const parts = dateString.split('/');
    const day = parseInt(parts[0] ?? '1', 10);
    const month = parseInt(parts[1] ?? '1', 10);
    const year = parseInt(parts[2] ?? '2025', 10);
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
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-[#A8E6CF]"/>
            Profits Dashboard
          </h2>
        </div>
      </div>

      {/* Combined Top Section: Totals */}
      <div className="bg-[#1C1C1C] rounded-lg p-6 shadow-lg flex flex-col md:flex-row gap-8 mb-12">
          {/* Total Profit Section (Left) */}
          <div className="flex flex-col items-center justify-center text-center md:w-1/4 md:border-r md:border-[#2E2E2E] md:pr-8">
              <p className="text-lg text-[#D9D9D9]">Total Profits</p>
              <p className="text-5xl font-bold text-[#A8E6CF] mt-2">{formatCurrency(totalProfit)}</p>
          </div>

          {/* Member Profits Section (Right) */}
          <div className="md:w-3/4 flex-grow">
              <h3 className="text-xl font-semibold text-[#F2F2F2] mb-4 text-center md:text-left">Member Profits</h3>
              {members.some(m => m.profits > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                      {members
                          .filter(m => m.profits > 0)
                          .sort((a,b) => b.profits - a.profits)
                          .map(member => (
                              <div key={member.id} className="text-center flex flex-col items-center">
                                  <MemberAvatar name={member.name} className="w-12 h-12 mx-auto mb-2 border-2 border-[#2E2E2E]"/>
                                  <p className="text-sm font-semibold text-[#F2F2F2] truncate w-full">{member.name}</p>
                                  <p className="text-sm font-mono text-[#A8E6CF]">{formatCurrency(member.profits)}</p>
                              </div>
                          ))
                      }
                  </div>
              ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-[#B0B0B0] text-center py-8">No members with profits.</p>
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
                  const dateData = profitsByDate[date];
                  if (!dateData) return null;
                  
                  const { totalProfit: dailyProfit, involvedMemberIds } = dateData;
                  const involvedMembers = members.filter(m => involvedMemberIds.includes(m.id));
                  
                  return (
                      <div key={date} className="bg-[#121212]/50 rounded-lg p-4 transition-all duration-300 hover:bg-[#2E2E2E]/50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                          <div>
                            <span className="text-xs font-medium text-[#A8E6CF] bg-[#A8E6CF]/10 px-3 py-1 rounded-full inline-block mb-1">
                              📅 {date}
                            </span>
                            <p className="font-semibold text-[#F2F2F2] mt-1">{formatDate(date)}</p>
                          </div>
                          <span className="font-mono font-semibold text-xl text-[#A8E6CF]">{formatCurrency(dailyProfit)}</span>
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
            <ArrowTrendingUpIcon className="w-16 h-16 mx-auto text-[#7A7A7A] mb-4"/>
            <h3 className="text-xl font-semibold text-[#F2F2F2]">No Profits Recorded</h3>
            <p className="text-[#D9D9D9] mt-2">Profits from bills will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfitsDashboard;
