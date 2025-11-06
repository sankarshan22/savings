import React from 'react';
import { UsersIcon, BillIcon, CheckCircleIcon, CurrencyRupeeIcon, ArrowTrendingUpIcon, DownloadIcon, ArrowTrendingDownIcon } from './icons/Icons';
import { formatCurrency } from './utils/currency';
import Button from './Button';

interface HomeDashboardProps {
  onNavigate: (view: 'members' | 'bills' | 'profits' | 'costs') => void;
  totalReimbursed: number;
  totalPending: number;
  onExportUnpaidBills: () => void;
  onShowPendingDetails: () => void;
  onShowReimbursedDetails: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, totalReimbursed, totalPending, onExportUnpaidBills, onShowPendingDetails, onShowReimbursedDetails }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F2F2] mb-2">Welcome to your Dashboard</h2>
      <p className="text-sm sm:text-base text-[#D9D9D9] mb-6 sm:mb-8 md:mb-12 px-4">Select an option below to get started.</p>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12">
          {/* Reimbursement Pending Card */}
          <div 
            className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 flex items-center shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 active:scale-95"
            onClick={onShowPendingDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onShowPendingDetails()}
            aria-label="View details for pending reimbursements"
          >
              <div className="p-2 sm:p-3 rounded-full bg-[#FFC857]/10 mr-3 sm:mr-4">
                  <CurrencyRupeeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFC857]" />
              </div>
              <div className="text-left">
                  <p className="text-xs sm:text-sm text-[#D9D9D9]">Total Reimbursement Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">{formatCurrency(totalPending)}</p>
              </div>
          </div>

          {/* Reimbursed Amount Card */}
          <div 
            className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 flex items-center shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 active:scale-95"
            onClick={onShowReimbursedDetails}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onShowReimbursedDetails()}
            aria-label="View details for reimbursed amounts"
          >
              <div className="p-2 sm:p-3 rounded-full bg-[#A8E6CF]/10 mr-3 sm:mr-4">
                  <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-[#A8E6CF]" />
              </div>
              <div className="text-left">
                  <p className="text-xs sm:text-sm text-[#D9D9D9]">Total Reimbursed</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">{formatCurrency(totalReimbursed)}</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {/* Team Members Card */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[#00C2A8]/20 active:scale-95 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
        >
          <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#00C2A8]" />
          <h3 className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-xl font-semibold text-[#F2F2F2]">Team Members</h3>
        </div>
        
        {/* Bills Card */}
        <div 
          onClick={() => onNavigate('bills')}
          className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[#4F8CFF]/20 active:scale-95 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
        >
          <BillIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#4F8CFF]" />
          <h3 className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-xl font-semibold text-[#F2F2F2]">Bills</h3>
        </div>
        
        {/* Profits Card */}
        <div 
          onClick={() => onNavigate('profits')}
          className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[#A8E6CF]/20 active:scale-95 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
        >
          <ArrowTrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#A8E6CF]" />
          <h3 className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-xl font-semibold text-[#F2F2F2]">Profits</h3>
        </div>

        {/* Costs Card */}
        <div 
          onClick={() => onNavigate('costs')}
          className="bg-[#1C1C1C] rounded-lg p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[#FF6B81]/20 active:scale-95 min-h-[120px] sm:min-h-[140px] md:min-h-[160px]"
        >
          <ArrowTrendingDownIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#FF6B81]" />
          <h3 className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-xl font-semibold text-[#F2F2F2]">Costs</h3>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 md:mt-12">
        <Button onClick={onExportUnpaidBills}>
          <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Export Unpaid Bills
        </Button>
      </div>

    </div>
  );
};

export default HomeDashboard;
