
import React from 'react';
import { UsersIcon, BillIcon, CheckCircleIcon, CurrencyRupeeIcon, ArrowTrendingUpIcon, DownloadIcon, ArrowTrendingDownIcon } from './icons/Icons';
import { formatCurrency } from '../utils/currency';
import Button from './Button';

interface HomeDashboardProps {
  onNavigate: (view: 'members' | 'bills' | 'profits' | 'costs') => void;
  totalReimbursed: number;
  totalPending: number;
  onExportUnpaidBills: () => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, totalReimbursed, totalPending, onExportUnpaidBills }) => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-[#F2F2F2] mb-2">Welcome to your Dashboard</h2>
      <p className="text-[#D9D9D9] mb-12">Select an option below to get started.</p>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          {/* Reimbursement Pending Card */}
          <div className="bg-[#1C1C1C] rounded-lg p-6 flex items-center shadow-lg">
              <div className="p-3 rounded-full bg-[#FFC857]/10 mr-4">
                  <CurrencyRupeeIcon className="w-8 h-8 text-[#FFC857]" />
              </div>
              <div>
                  <p className="text-sm text-[#D9D9D9]">Total Reimbursement Pending</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">{formatCurrency(totalPending)}</p>
              </div>
          </div>

          {/* Reimbursed Amount Card */}
          <div className="bg-[#1C1C1C] rounded-lg p-6 flex items-center shadow-lg">
              <div className="p-3 rounded-full bg-[#A8E6CF]/10 mr-4">
                  <CheckCircleIcon className="w-8 h-8 text-[#A8E6CF]" />
              </div>
              <div>
                  <p className="text-sm text-[#D9D9D9]">Total Reimbursed</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">{formatCurrency(totalReimbursed)}</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Team Members Card */}
        <div 
          onClick={() => onNavigate('members')}
          className="bg-[#1C1C1C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 hover:shadow-[#00C2A8]/20"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('members')}
          aria-label="Navigate to Team Members"
        >
          <UsersIcon className="w-16 h-16 text-[#00C2A8] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Team Members</h3>
          <p className="text-[#D9D9D9]">Manage member details, reimbursements, and more.</p>
        </div>

        {/* Bills Card */}
        <div 
          onClick={() => onNavigate('bills')}
          className="bg-[#1C1C1C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 hover:shadow-[#4F8CFF]/20"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('bills')}
          aria-label="Navigate to Bills"
        >
          <BillIcon className="w-16 h-16 text-[#4F8CFF] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Bills</h3>
          <p className="text-[#D9D9D9]">Track and manage your upcoming and paid bills.</p>
        </div>

        {/* Profits Card */}
        <div 
          onClick={() => onNavigate('profits')}
          className="bg-[#1C1C1C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 hover:shadow-[#A8E6CF]/20"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('profits')}
          aria-label="Navigate to Profits"
        >
          <ArrowTrendingUpIcon className="w-16 h-16 text-[#A8E6CF] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Profits</h3>
          <p className="text-[#D9D9D9]">Analyze profit trends and daily earnings.</p>
        </div>

        {/* Costs Card */}
        <div 
          onClick={() => onNavigate('costs')}
          className="bg-[#1C1C1C] rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-[#2E2E2E]/50 hover:shadow-[#FF6B81]/20"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('costs')}
          aria-label="Navigate to Costs"
        >
          <ArrowTrendingDownIcon className="w-16 h-16 text-[#FF6B81] mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Costs</h3>
          <p className="text-[#D9D9D9]">Review spending and daily costs.</p>
        </div>
      </div>

      {/* Export Button Section */}
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="bg-[#1C1C1C] rounded-lg p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-1">Export Data</h3>
                <p className="text-[#D9D9D9]">Download a CSV file of all bills that have not been paid back.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex-shrink-0">
                <Button onClick={onExportUnpaidBills}>
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export Unpaid Bills
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
