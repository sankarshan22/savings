
import React, { useState, useMemo, useEffect } from 'react';
import { Bill, Member } from '../types';
import Button from './Button';
import Modal from './Modal';
import { ChevronLeftIcon, BillIcon, PlusIcon, TrashIcon } from './icons/Icons';
import BillCard from './BillCard';
import AddBillForm from './AddBillForm';
import BillDetails from './BillDetails';
import MemberAvatarList from './MemberAvatarList';
import { formatCurrency } from './utils/currency';
import DateMemberCard from './DateMemberCard';
import { DatePaymentStatus } from '../App';
import MemberAvatar from './MemberAvatar';

interface BillsProps {
  onBack: () => void;
  members: Member[];
  bills: Bill[];
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  onEditBill: (bill: Bill) => void;
  onRemoveBill: (id: string) => void;
  onRemoveBillsByDate: (date: string) => void;
  datePaymentStatus: Record<string, DatePaymentStatus>;
  onDateStatusChange: (date: string, status: DatePaymentStatus) => void;
}

const Bills: React.FC<BillsProps> = ({ onBack, members, bills, onAddBill, onEditBill, onRemoveBill, onRemoveBillsByDate, datePaymentStatus, onDateStatusChange }) => {
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [modalView, setModalView] = useState<'bills' | 'members'>('bills');
  const [selectedMemberIdInModal, setSelectedMemberIdInModal] = useState<string | null>(null);
  const [dateToDelete, setDateToDelete] = useState<string | null>(null);


  const handleSaveBill = (billData: Bill | Omit<Bill, 'id'>) => {
    if ('id' in billData) {
      onEditBill(billData);
    } else {
      onAddBill(billData);
    }
    setIsAddBillModalOpen(false);
    setEditingBill(null);
  };
  
  const openDateModal = (date: string) => {
    setSelectedDateForModal(date);
    setModalView('bills'); // Reset to default view when opening
    setSelectedMemberIdInModal(null); // Reset member selection
  };
  
  const handleCloseDateModal = () => {
    setSelectedDateForModal(null);
    setSelectedMemberIdInModal(null); // Also reset here
  };
  
  const handleViewChange = (view: 'bills' | 'members') => {
    setModalView(view);
    setSelectedMemberIdInModal(null); // Reset when switching views
  };
  
  const handleConfirmDelete = () => {
    if (dateToDelete) {
      onRemoveBillsByDate(dateToDelete);
      setDateToDelete(null);
    }
  };

  const selectedBill = bills.find(bill => bill.id === selectedBillId);

  // Group bills by date
  const billsByDate = useMemo(() => {
    return bills.reduce((acc, bill) => {
      const dateKey = bill.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(bill);
      return acc;
    }, {} as Record<string, Bill[]>);
  }, [bills]);
  
  useEffect(() => {
    if (selectedDateForModal && (!billsByDate[selectedDateForModal] || billsByDate[selectedDateForModal].length === 0)) {
        setSelectedDateForModal(null);
    }
  }, [billsByDate, selectedDateForModal]);

  const sortedDates = useMemo(() => {
    return Object.keys(billsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [billsByDate]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const billsOnSelectedDate = selectedDateForModal ? (billsByDate[selectedDateForModal] || []) : [];

  const totalProfitOnDate = useMemo(() => {
    if (!selectedDateForModal || !billsOnSelectedDate) return 0;
    return billsOnSelectedDate.reduce((sum, bill) => sum + bill.profit, 0);
  }, [billsOnSelectedDate, selectedDateForModal]);

  const involvedMembersOnDate = useMemo(() => {
      if (!selectedDateForModal || !billsOnSelectedDate) return [];
      const uniqueMemberIds = [...new Set(billsOnSelectedDate.flatMap(b => b.amountSharedBy))];
      return uniqueMemberIds
        .map(id => members.find(m => m.id === id))
        .filter((m): m is Member => !!m);
  }, [billsOnSelectedDate, selectedDateForModal, members]);

  const dateSpecificTotals = useMemo(() => {
    if (!selectedDateForModal || !billsOnSelectedDate) return new Map();
    
    const totals = new Map<string, { cost: number; profit: number }>();
    const profitPerMember = involvedMembersOnDate.length > 0 ? totalProfitOnDate / involvedMembersOnDate.length : 0;

    involvedMembersOnDate.forEach(member => {
        totals.set(member.id, { cost: 0, profit: profitPerMember });
    });

    billsOnSelectedDate.forEach(bill => {
        if (bill.amountSharedBy.length > 0) {
            const costPerShare = bill.amount / bill.amountSharedBy.length;
            bill.amountSharedBy.forEach(memberId => {
                const memberTotal = totals.get(memberId);
                if (memberTotal) {
                    memberTotal.cost += costPerShare;
                }
            });
        }
    });

    return totals;
  }, [selectedDateForModal, billsOnSelectedDate, involvedMembersOnDate, totalProfitOnDate]);

  const selectedMemberForDetails = useMemo(() => {
    if (!selectedMemberIdInModal) return null;
    return members.find(m => m.id === selectedMemberIdInModal);
  }, [selectedMemberIdInModal, members]);

  const billsForSelectedMemberOnDate = useMemo(() => {
      if (!selectedMemberIdInModal || !selectedDateForModal) return [];
      return billsByDate[selectedDateForModal]?.filter(bill => bill.amountSharedBy.includes(selectedMemberIdInModal)) || [];
  }, [selectedMemberIdInModal, selectedDateForModal, billsByDate]);


  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={onBack} 
            className="p-2 rounded-full bg-[#1C1C1C] text-[#D9D9D9] hover:bg-[#2E2E2E] hover:text-[#F2F2F2] active:bg-[#2E2E2E] transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#F2F2F2] flex items-center">
            <BillIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#4F8CFF]"/>
            Bills
          </h2>
        </div>
        <Button onClick={() => setIsAddBillModalOpen(true)} className="w-full sm:w-auto">
          <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Add Bill
        </Button>
      </div>

      {bills.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {sortedDates.map(date => {
            const billsOnDate = billsByDate[date] || [];
            const uniqueMemberIds = [...new Set(billsOnDate.flatMap(b => b.amountSharedBy))];
            const involvedMembers = uniqueMemberIds
              .map(id => members.find(m => m.id === id))
              .filter((m): m is Member => !!m);
            const isDatePaidForGroup = datePaymentStatus[date] === 'paid';
            
            return (
              <div 
                key={date}
                className="bg-[#1C1C1C] rounded-lg shadow-lg p-4 sm:p-5 group relative transition-all duration-300 hover:bg-[#2E2E2E]/50 hover:shadow-[#4F8CFF]/20"
              >
                <div
                    onClick={() => openDateModal(date)}
                    className="cursor-pointer active:bg-[#2E2E2E]/50 rounded-lg p-1 -m-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDateModal(date)}
                    aria-label={`View bills for ${formatDate(date)}`}
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-[#F2F2F2] truncate">{formatDate(date)}</h3>
                        <p className="text-sm text-[#D9D9D9] mt-1">{billsOnDate.length} bill(s) recorded</p>
                        </div>
                        <div className="text-right">
                        <h4 className="text-sm font-semibold text-[#D9D9D9] mb-2">Members Involved</h4>
                        <MemberAvatarList members={involvedMembers} alignment="justify-end"/>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#2E2E2E]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isDatePaidForGroup) {
                                setDateToDelete(date);
                            }
                        }}
                        disabled={!isDatePaidForGroup}
                        title={!isDatePaidForGroup ? "Mark as 'Paid Back' to enable deletion." : `Delete all bills for ${formatDate(date)}`}
                        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                            isDatePaidForGroup
                            ? 'bg-[#FF6B81]/10 text-[#FF6B81] hover:bg-[#FF6B81]/20 cursor-pointer'
                            : 'bg-[#2E2E2E]/50 text-[#7A7A7A] cursor-not-allowed opacity-70'
                        }`}
                        aria-disabled={!isDatePaidForGroup}
                        aria-label={isDatePaidForGroup ? `Delete all bills for ${formatDate(date)}` : `Cannot delete bills for this date until marked as paid back`}
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete All ({billsOnDate.length})
                    </button>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDateStatusChange(date, 'unpaid');
                            }}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                datePaymentStatus[date] !== 'paid'
                                ? 'bg-[#FF6B81]/20 text-[#FF6B81] ring-2 ring-[#FF6B81]/50'
                                : 'bg-[#2E2E2E] text-[#7A7A7A] hover:bg-[#3C3C3C] hover:text-[#FF6B81]'
                            }`}
                        >
                            Not Paid Back
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDateStatusChange(date, 'paid');
                            }}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                                datePaymentStatus[date] === 'paid'
                                ? 'bg-[#A8E6CF]/20 text-[#A8E6CF] ring-2 ring-[#A8E6CF]/50'
                                : 'bg-[#2E2E2E] text-[#7A7A7A] hover:bg-[#3C3C3C] hover:text-[#A8E6CF]'
                            }`}
                        >
                            Paid Back
                        </button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-[#1C1C1C] rounded-lg">
          <BillIcon className="w-16 h-16 mx-auto text-[#7A7A7A] mb-4"/>
          <h3 className="text-xl font-semibold text-[#F2F2F2]">No Bills Found</h3>
          <p className="text-[#D9D9D9] mt-2">Get started by adding a new bill.</p>
        </div>
      )}
      
      {selectedDateForModal && billsOnSelectedDate.length > 0 && (
        <Modal isOpen={!!selectedDateForModal} onClose={handleCloseDateModal} size="5xl">
          <div className="p-2">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Bills: {formatDate(selectedDateForModal)}
              </h2>

              <div className="flex bg-[#121212]/50 rounded-lg p-4 mb-6">
                <div className="w-1/4 pr-4 border-r border-[#2E2E2E] flex flex-col justify-center items-center">
                    <h4 className="text-sm font-semibold text-[#D9D9D9] mb-2">Total Profits</h4>
                    <p className="text-3xl font-bold text-[#A8E6CF]">{formatCurrency(totalProfitOnDate)}</p>
                </div>
                <div className="w-3/4 pl-4">
                    <h4 className="text-sm font-semibold text-[#D9D9D9] mb-3">Involved Members</h4>
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        {involvedMembersOnDate.map(member => (
                            <div key={member.id} className="flex items-center gap-2">
                                <MemberAvatar name={member.name} className="w-8 h-8 ring-2 ring-[#2E2E2E]" />
                                <span className="text-sm text-[#F2F2F2]">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-1">
                {/* Drill-down or Main View */}
                {selectedMemberForDetails ? (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => setSelectedMemberIdInModal(null)}
                            className="px-4 py-2 rounded-md bg-[#2E2E2E] text-[#F2F2F2] hover:bg-[#3C3C3C] transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                            Back to Members
                        </button>
                        <div className="flex items-center gap-2 border-l border-[#2E2E2E] pl-4">
                            <MemberAvatar name={selectedMemberForDetails.name} className="w-9 h-9 ring-2 ring-[#2E2E2E]" />
                            <h3 className="text-xl font-semibold text-[#F2F2F2]">
                                Bills involving {selectedMemberForDetails.name}
                            </h3>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {billsForSelectedMemberOnDate.length > 0 ? (
                            billsForSelectedMemberOnDate.map(bill => (
                                <BillCard 
                                    key={bill.id} 
                                    bill={bill} 
                                    members={members}
                                    onEdit={setEditingBill}
                                    onRemove={onRemoveBill}
                                    onSelect={() => setSelectedBillId(bill.id)}
                                    canBeDeleted={datePaymentStatus[selectedDateForModal] === 'paid'}
                                />
                            ))
                        ) : (
                            <p className="text-center text-[#D9D9D9] py-8">No bills found for this member on this date.</p>
                        )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* View Switcher */}
                    <div className="flex justify-center gap-4 mb-6">
                      <button
                          onClick={() => handleViewChange('bills')}
                          className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${
                              modalView === 'bills'
                                  ? 'bg-[#4F8CFF] text-white shadow-md'
                                  : 'bg-[#2E2E2E] text-[#F2F2F2] hover:bg-[#3C3C3C]'
                          }`}
                      >
                          All Bills
                      </button>
                      <button
                          onClick={() => handleViewChange('members')}
                          className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors ${
                              modalView === 'members'
                                  ? 'bg-[#4F8CFF] text-white shadow-md'
                                  : 'bg-[#2E2E2E] text-[#F2F2F2] hover:bg-[#3C3C3C]'
                          }`}
                      >
                          Members
                      </button>
                    </div>

                    {/* Content based on view */}
                    {modalView === 'bills' ? (
                      <div className="space-y-4">
                          {billsOnSelectedDate.map(bill => (
                              <BillCard 
                                  key={bill.id} 
                                  bill={bill} 
                                  members={members}
                                  onEdit={setEditingBill}
                                  onRemove={onRemoveBill}
                                  onSelect={() => setSelectedBillId(bill.id)}
                                  canBeDeleted={datePaymentStatus[selectedDateForModal] === 'paid'}
                              />
                          ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {involvedMembersOnDate.map(member => {
                              const totals = dateSpecificTotals.get(member.id) || { cost: 0, profit: 0 };
                              return (
                                  <DateMemberCard 
                                      key={member.id}
                                      member={member}
                                      dateCost={totals.cost}
                                      dateProfit={totals.profit}
                                      onSelect={setSelectedMemberIdInModal}
                                  />
                              );
                          })}
                      </div>
                    )}
                  </>
                )}
              </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {dateToDelete && (
        <Modal isOpen={!!dateToDelete} onClose={() => setDateToDelete(null)} size="md">
          <div className="text-center p-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#FF6B81]/20">
                <TrashIcon className="h-6 w-6 text-[#FF6B81]" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white mt-4">Delete All Bills for this Date?</h3>
            <p className="mt-2 text-[#D9D9D9]">
                Are you sure you want to delete all {billsByDate[dateToDelete]?.length || 0} bills for{' '}
                <strong>{formatDate(dateToDelete)}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setDateToDelete(null)}
                className="px-6 py-2 bg-[#3C3C3C] text-white font-semibold rounded-lg hover:bg-[#5A5A5A] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-[#FF6B81] text-white font-semibold rounded-lg shadow-md hover:bg-[#ff4d67] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#FF6B81]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Bill Modal */}
      <Modal isOpen={isAddBillModalOpen} onClose={() => setIsAddBillModalOpen(false)} size="3xl">
        <AddBillForm onSave={handleSaveBill} onClose={() => setIsAddBillModalOpen(false)} members={members} />
      </Modal>

      {/* Edit Bill Modal */}
      {editingBill && (
          <Modal isOpen={!!editingBill} onClose={() => setEditingBill(null)} size="3xl">
              <AddBillForm 
                onSave={handleSaveBill} 
                onClose={() => setEditingBill(null)} 
                members={members} 
                initialBill={editingBill}
              />
          </Modal>
      )}

      {selectedBill && (
        <Modal isOpen={!!selectedBill} onClose={() => setSelectedBillId(null)} size="lg">
          <BillDetails bill={selectedBill} members={members} />
        </Modal>
      )}
    </div>
  );
};

export default Bills;
