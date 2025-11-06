
import React, { useState } from 'react';
import { Member, Bill, Settlement } from '../types';
import { formatCurrency } from './utils/currency';
import MemberAvatar from './MemberAvatar';
import Modal from './Modal';
import SettleDebtForm from './SettleDebtForm';
import { CheckCircleIcon } from './icons/Icons';

interface MemberDetailsProps {
  member: Member;
  bills: Bill[];
  members: Member[];
  onAddSettlement: (settlement: Omit<Settlement, 'id'>) => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, bills, members, onAddSettlement }) => {
  const [settlementInfo, setSettlementInfo] = useState<{ debtor: Member, amount: number } | null>(null);
  const reimbursementProgress = member.reimbursementAmt > 0 ? (member.reimbursedAmt / member.reimbursementAmt) * 100 : 0;

  const involvedBills = bills.filter(bill => bill.amountSharedBy.includes(member.id));

  const handleSettle = (settledAmount: number, settledDate: string) => {
    if (!settlementInfo) return;
    onAddSettlement({
      fromMemberId: settlementInfo.debtor.id, // Who paid
      toMemberId: member.id,                  // Who received
      amount: settledAmount,
      date: settledDate,
    });
    setSettlementInfo(null); // Close modal
  };

  return (
    <>
    <div className="p-2">
      <div className="flex items-center mb-6">
        <MemberAvatar
            name={member.name}
            className="w-20 h-20 border-4 border-[#2E2E2E]"
        />
        <div className="ml-4">
            <h3 className="text-2xl font-bold text-[#FFFFFF]">{member.name}</h3>
        </div>
      </div>
      
      <div className="space-y-5 text-sm">
        {/* Costs and Profits */}
        <div className="flex justify-around bg-[#2E2E2E]/50 p-3 rounded-md">
            <div className="text-center">
                <p className="text-[#D9D9D9]">Total Costs</p>
                <p className="font-semibold text-lg text-[#FF6B81]">{formatCurrency(member.costs)}</p>
            </div>
             <div className="text-center">
                <p className="text-sm text-[#D9D9D9]">Total Owed</p>
                <p className="font-semibold text-lg text-[#FFC857]">{formatCurrency(member.totalOwed)}</p>
            </div>
            <div className="text-center">
                <p className="text-[#D9D9D9]">Total Profits</p>
                <p className="font-semibold text-lg text-[#A8E6CF]">{formatCurrency(member.profits)}</p>
            </div>
        </div>

        {/* Debts Owed */}
        <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-2">Debts (Owed to Others)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {member.totalOwed > 0 && Object.keys(member.debts.owedTo).length > 0 ? (
                    Object.entries(member.debts.owedTo).map(([owedToId, amount]) => {
                        const creditor = members.find(m => m.id === owedToId);
                        // FIX: Cast `amount` to number for comparison and formatting, as Object.entries can infer `unknown` type.
                        if (!creditor || (amount as number) <= 0) return null;
                        return (
                            <div key={owedToId} className="flex justify-between items-center bg-[#121212]/50 p-2 rounded">
                                <div className="flex items-center gap-3">
                                    <MemberAvatar name={creditor.name} className="w-8 h-8" />
                                    <div>
                                        <p className="text-xs text-[#B0B0B0]">Owed to</p>
                                        <p className="text-[#F2F2F2] font-medium">{creditor.name}</p>
                                    </div>
                                </div>
                                <p className="font-mono text-lg text-[#FFC857]">{formatCurrency(amount as number)}</p>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-[#B0B0B0] text-xs italic text-center py-4">No outstanding debts</p>
                )}
            </div>
        </div>

        {/* Credits Owed By */}
        <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-2">Credits (Owed by Others)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {member.totalOwedBy > 0 && Object.keys(member.debts.owedBy).length > 0 ? (
                    Object.entries(member.debts.owedBy).map(([owedById, amount]) => {
                        const debtor = members.find(m => m.id === owedById);
                        if (!debtor || (amount as number) <= 0) return null;
                        return (
                            <div key={owedById} className="flex justify-between items-center bg-[#121212]/50 p-2 rounded">
                                 <div className="flex items-center gap-3">
                                    <MemberAvatar name={debtor.name} className="w-8 h-8" />
                                    <div>
                                        <p className="text-xs text-[#B0B0B0]">Owed by</p>
                                        <p className="text-[#F2F2F2] font-medium">{debtor.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <p className="font-mono text-lg text-[#A8E6CF]">{formatCurrency(amount as number)}</p>
                                  <button
                                    onClick={() => setSettlementInfo({ debtor, amount: amount as number })}
                                    className="p-2 rounded-full bg-[#A8E6CF]/20 text-[#A8E6CF] hover:bg-[#A8E6CF]/40 transition-colors"
                                    aria-label={`Settle debt from ${debtor.name}`}
                                    title="Settle Debt"
                                  >
                                    <CheckCircleIcon className="w-5 h-5" />
                                  </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-[#B0B0B0] text-xs italic text-center py-4">No outstanding credits</p>
                )}
            </div>
        </div>


        {/* Reimbursement */}
        <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-2">Reimbursement</h4>
            <div className="text-xs text-[#D9D9D9] mb-1 flex justify-between">
                <span>{formatCurrency(member.reimbursedAmt)}</span>
                <span>{formatCurrency(member.reimbursementAmt)}</span>
            </div>
            <div className="w-full bg-[#2E2E2E] rounded-full h-2.5">
                <div 
                    className="bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF] h-2.5 rounded-full" 
                    style={{ width: `${reimbursementProgress}%` }}
                ></div>
            </div>
        </div>

        {/* Reimbursement History */}
        <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-2">Reimbursement History</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {member.reimbursementHistory.length > 0 ? (
                    member.reimbursementHistory.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-[#121212]/50 p-2 rounded">
                            <div>
                                <p className="text-[#F2F2F2]">{item.description}</p>
                                <p className="text-xs text-[#B0B0B0]">{item.date}</p>
                            </div>
                            <p className="font-mono text-[#00C2A8]">{formatCurrency(item.amount)}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-[#B0B0B0] text-xs italic text-center py-4">No reimbursement history</p>
                )}
            </div>
        </div>

        {/* Bill Involvement */}
        <div>
            <h4 className="font-semibold text-[#F2F2F2] mb-2">Bill Involvement (Costs Shared)</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {involvedBills.length > 0 ? (
                    involvedBills.map(bill => {
                        const costShare = bill.amount / bill.amountSharedBy.length;
                        return (
                            <div key={bill.id} className="flex justify-between items-center bg-[#121212]/50 p-2 rounded">
                                <div>
                                    <p className="text-[#F2F2F2]">Bill from {bill.from}</p>
                                    <p className="text-xs text-[#B0B0B0]">{bill.date} - {bill.reason}</p>
                                </div>
                                <p className="font-mono text-[#FF6B81]">{formatCurrency(costShare)}</p>
                            </div>
                        )
                    })
                ) : (
                    <p className="text-[#B0B0B0] text-xs italic text-center py-4">Not involved in sharing costs for any bills</p>
                )}
            </div>
        </div>

      </div>
    </div>
    {settlementInfo && (
        <Modal isOpen={!!settlementInfo} onClose={() => setSettlementInfo(null)}>
            <SettleDebtForm
                creditor={member}
                debtor={settlementInfo.debtor}
                maxAmount={settlementInfo.amount}
                onSettle={handleSettle}
                onClose={() => setSettlementInfo(null)}
            />
        </Modal>
    )}
    </>
  );
};

export default MemberDetails;