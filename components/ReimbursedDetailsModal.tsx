import React from 'react';
import Modal from './Modal';
import { formatCurrency } from './utils/currency';
import MemberAvatar from './MemberAvatar';
import { CheckCircleIcon } from './icons/Icons';

interface ReimbursedDetail {
    memberId: string;
    memberName: string;
    totalAmount: number;
}

interface ReimbursedDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReimbursedDetail[];
}

const ReimbursedDetailsModal: React.FC<ReimbursedDetailsModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-2">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Reimbursed Breakdown
        </h2>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {data.length > 0 ? (
                data.map(({ memberId, memberName, totalAmount }) => (
                    <div key={memberId} className="flex items-center justify-between bg-[#2E2E2E]/50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <MemberAvatar name={memberName} className="w-10 h-10" />
                            <span className="font-medium text-white">{memberName}</span>
                        </div>
                        <span className="font-mono text-lg text-[#A8E6CF]">{formatCurrency(totalAmount)}</span>
                    </div>
                ))
            ) : (
                <div className="text-center py-10">
                    <CheckCircleIcon className="w-12 h-12 mx-auto text-[#7A7A7A] mb-4"/>
                    <p className="text-[#B0B0B0]">No reimbursed amounts found from paid bills.</p>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default ReimbursedDetailsModal;
