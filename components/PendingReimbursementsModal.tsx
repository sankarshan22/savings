
import React from 'react';
import Modal from './Modal';
import { formatCurrency } from './utils/currency';
import MemberAvatar from './MemberAvatar';
import { CurrencyRupeeIcon } from './icons/Icons';

interface PendingDetail {
    memberId: string;
    memberName: string;
    totalAmount: number;
}

interface PendingReimbursementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PendingDetail[];
}

const PendingReimbursementsModal: React.FC<PendingReimbursementsModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-2">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Pending Reimbursements Breakdown
        </h2>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {data.length > 0 ? (
                data.map(({ memberId, memberName, totalAmount }) => (
                    <div key={memberId} className="flex items-center justify-between bg-[#2E2E2E]/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <MemberAvatar name={memberName} className="w-10 h-10" />
                            <span className="font-medium text-white">{memberName}</span>
                        </div>
                        <span className="font-mono text-lg text-[#FFC857]">{formatCurrency(totalAmount)}</span>
                    </div>
                ))
            ) : (
                <div className="text-center py-10">
                    <CurrencyRupeeIcon className="w-12 h-12 mx-auto text-[#7A7A7A] mb-4"/>
                    <p className="text-[#B0B0B0]">No pending reimbursements found.</p>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default PendingReimbursementsModal;
