import React, { useState, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import Bills from './components/Bills';
import ProfitsDashboard from './components/ProfitsDashboard';
import { Member, Bill, ExportGroup, Settlement } from './types';
import { exportUnpaidBillsByMemberToCsv } from './components/utils/csv';
import ExportPreview from './components/ExportPreview';
import CostsDashboard from './components/CostsDashboard';
import { formatCurrency } from './components/utils/currency';
import { formatDateToDDMMYYYY } from './components/utils/helpers';
import PendingReimbursementsModal from './components/PendingReimbursementsModal';
import ReimbursedDetailsModal from './components/ReimbursedDetailsModal';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import { useMembers } from './hooks/useMembers';
import { useBills } from './hooks/useBills';
import { useSettlements } from './hooks/useSettlements';
import { useDatePaymentStatus } from './hooks/useDatePaymentStatus';

type View = 'home' | 'members' | 'bills' | 'profits' | 'costs' | 'export-preview';
export type DatePaymentStatus = 'paid' | 'unpaid';

// This function calculates costs and profits based on the full list of bills and settlements.
const calculateMemberTotals = (baseMembers: Member[], currentBills: Bill[], settlements: Settlement[]): Member[] => {
  const memberMap = new Map<string, Member>(
    baseMembers.map(m => [m.id, {
      ...m,
      costs: 0,
      profits: 0,
      reimbursementAmt: 0,
      reimbursedAmt: 0,
      reimbursementHistory: [],
      debts: { owedTo: {}, owedBy: {} },
      totalOwed: 0,
      totalOwedBy: 0,
    }])
  );

  // 1. Process Bills for Costs and Debts (per-bill logic)
  currentBills.forEach(bill => {
    const payer = memberMap.get(bill.paidBy);
    if (!payer) return;

    // Cost is only for the payer
    payer.costs += bill.amount;
    
    // Debt Calculation
    if (bill.amount > 0 && bill.amountSharedBy.length > 0) {
      const costPerShare = bill.amount / bill.amountSharedBy.length;
      bill.amountSharedBy.forEach(debtorId => {
        if (debtorId === bill.paidBy) return; // Member doesn't owe themselves
        const debtor = memberMap.get(debtorId);
        const creditor = memberMap.get(bill.paidBy);
        if (debtor && creditor) {
          debtor.debts.owedTo[creditor.id] = (debtor.debts.owedTo[creditor.id] || 0) + costPerShare;
          creditor.debts.owedBy[debtor.id] = (creditor.debts.owedBy[debtor.id] || 0) + costPerShare;
        }
      });
    }
  });

  // 2. Process Daily Profits by pooling profits for each day
  const billsByDate = new Map<string, Bill[]>();
  currentBills.forEach(bill => {
      if (!billsByDate.has(bill.date)) {
          billsByDate.set(bill.date, []);
      }
      billsByDate.get(bill.date)!.push(bill);
  });

  billsByDate.forEach((dailyBills) => {
      const totalDailyProfit = dailyBills.reduce((sum, bill) => sum + bill.profit, 0);
      if (totalDailyProfit > 0) {
          const involvedMemberIds = new Set<string>();
          dailyBills.forEach(bill => {
              bill.amountSharedBy.forEach(id => involvedMemberIds.add(id));
          });

          if (involvedMemberIds.size > 0) {
              const profitPerMember = totalDailyProfit / involvedMemberIds.size;
              involvedMemberIds.forEach(memberId => {
                  const member = memberMap.get(memberId);
                  if (member) {
                      member.profits += profitPerMember;
                  }
              });
          }
      }
  });


  // 3. Calculate initial reimbursement amount from bill debts
  for (const member of memberMap.values()) {
    member.reimbursementAmt = Object.values(member.debts.owedBy).reduce((sum, amount) => sum + amount, 0);
  }
  
  // 4. Process Settlements to adjust debts and calculate reimbursed amount
  settlements.forEach(settlement => {
    const fromMember = memberMap.get(settlement.fromMemberId);
    const toMember = memberMap.get(settlement.toMemberId);

    if (fromMember && toMember) {
      const amountToSettle = settlement.amount;
      const currentDebt = fromMember.debts.owedTo[toMember.id] || 0;
      
      // Prevent settling more than owed
      const actualSettlement = Math.min(amountToSettle, currentDebt);
      
      fromMember.debts.owedTo[toMember.id] = Math.max(0, currentDebt - actualSettlement);
      
      const currentCredit = toMember.debts.owedBy[fromMember.id] || 0;
      toMember.debts.owedBy[fromMember.id] = Math.max(0, currentCredit - actualSettlement);

      toMember.reimbursedAmt += actualSettlement;
      toMember.reimbursementHistory.push({
        id: settlement.id,
        date: settlement.date,
        amount: actualSettlement,
        description: `Payment from ${fromMember.name}`
      });
    }
  });

  // 5. Final calculation of totalOwed and totalOwedBy after settlements
  for (const member of memberMap.values()) {
    member.totalOwed = Object.values(member.debts.owedTo).reduce((sum, amount) => sum + amount, 0);
    member.totalOwedBy = Object.values(member.debts.owedBy).reduce((sum, amount) => sum + amount, 0);
  }

  return Array.from(memberMap.values());
};


const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('isAuthenticated') === 'true');
    const [view, setView] = useState<View>('home');
    const [exportData, setExportData] = useState<ExportGroup[]>([]);
    const [pendingDetails, setPendingDetails] = useState<{ memberId: string, memberName: string; totalAmount: number; }[]>([]);
    const [isPendingDetailsModalOpen, setIsPendingDetailsModalOpen] = useState(false);
    const [reimbursedDetails, setReimbursedDetails] = useState<{ memberId: string, memberName: string; totalAmount: number; }[]>([]);
    const [isReimbursedDetailsModalOpen, setIsReimbursedDetailsModalOpen] = useState(false);

    // Supabase hooks for data management (no auth required - just storage)
    const { members, loading: membersLoading, addMember, removeMember } = useMembers();
    const { bills, loading: billsLoading, addBill, updateBill, removeBill } = useBills();
    const { settlements, loading: settlementsLoading, addSettlement } = useSettlements();
    const { datePaymentStatus, loading: dateStatusLoading, updateDateStatus } = useDatePaymentStatus();

    const isLoading = membersLoading || billsLoading || settlementsLoading || dateStatusLoading;

    const membersWithTotals = useMemo(() => {
        return calculateMemberTotals(members, bills, settlements);
    }, [members, bills, settlements]);

    const handleLogin = (loginId: string, password: string): boolean => {
        const correctLoginId = import.meta.env.VITE_LOGIN_ID || 'IYKYK_ADMIN';
        const correctPassword = import.meta.env.VITE_LOGIN_PASSWORD || 'iykyk_password';

        if (loginId === correctLoginId && password === correctPassword) {
            sessionStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    const handleAddMember = async (memberData: { name: string }) => {
        await addMember(memberData);
    };

    const handleRemoveMember = async (id: string) => {
        await removeMember(id);
    };

    const handleAddBill = async (billData: Omit<Bill, 'id'>) => {
        await addBill(billData);
    };
    
    const handleEditBill = async (updatedBill: Bill) => {
        await updateBill(updatedBill);
    };

    const handleRemoveBill = async (id: string) => {
        await removeBill(id);
    };
    
    const handleRemoveBillsByDate = async (date: string) => {
        // Remove all bills with this date
        const billsToRemove = bills.filter(b => b.date === date);
        for (const bill of billsToRemove) {
            await removeBill(bill.id);
        }
        // Clear date status by setting to 'unpaid' then removing reference
        // Note: Supabase handles deletion internally when needed
    };

    const handleAddSettlement = async (settlementData: Omit<Settlement, 'id'>) => {
        await addSettlement(settlementData);
    };

    const handleDateStatusChange = async (date: string, status: DatePaymentStatus) => {
        try {
            await updateDateStatus(date, status);
        } catch (error) {
            // Silent fail - error already logged in hook
        }
    };

    const handleShowPendingDetails = () => {
        const unpaidBills = bills.filter(bill => datePaymentStatus[bill.date] !== 'paid');
        const pendingMap = new Map<string, number>();
    
        unpaidBills.forEach(bill => {
            // Credit the payer with the full cost of the bill
            if (bill.paidBy) {
                pendingMap.set(bill.paidBy, (pendingMap.get(bill.paidBy) || 0) + bill.amount);
            }
    
            // Distribute the profit to all members who shared the bill
            if (bill.profit > 0 && bill.amountSharedBy.length > 0) {
                const profitPerShare = bill.profit / bill.amountSharedBy.length;
                bill.amountSharedBy.forEach(memberId => {
                    pendingMap.set(memberId, (pendingMap.get(memberId) || 0) + profitPerShare);
                });
            }
        });
        
        const calculatedData = Array.from(pendingMap.entries())
            .map(([memberId, totalAmount]) => {
                const member = members.find(m => m.id === memberId);
                return {
                    memberId,
                    memberName: member ? member.name : 'Unknown Member',
                    totalAmount,
                };
            })
            .filter(item => item.totalAmount > 0.01) // Filter out negligible amounts
            .sort((a, b) => b.totalAmount - a.totalAmount);
    
        setPendingDetails(calculatedData);
        setIsPendingDetailsModalOpen(true);
    };

    const handleShowReimbursedDetails = () => {
        const paidBills = bills.filter(bill => datePaymentStatus[bill.date] === 'paid');
        const reimbursedMap = new Map<string, number>();

        paidBills.forEach(bill => {
            // Credit the payer with the full cost of the bill
            if (bill.paidBy) {
                reimbursedMap.set(bill.paidBy, (reimbursedMap.get(bill.paidBy) || 0) + bill.amount);
            }
    
            // Distribute the profit to all members who shared the bill
            if (bill.profit > 0 && bill.amountSharedBy.length > 0) {
                const profitPerShare = bill.profit / bill.amountSharedBy.length;
                bill.amountSharedBy.forEach(memberId => {
                    reimbursedMap.set(memberId, (reimbursedMap.get(memberId) || 0) + profitPerShare);
                });
            }
        });

        const calculatedData = Array.from(reimbursedMap.entries())
            .map(([memberId, totalAmount]) => {
                const member = members.find(m => m.id === memberId);
                return {
                    memberId,
                    memberName: member ? member.name : 'Unknown Member',
                    totalAmount,
                };
            })
            .filter(item => item.totalAmount > 0.01) // Filter out negligible amounts
            .sort((a, b) => b.totalAmount - a.totalAmount);
    
        setReimbursedDetails(calculatedData);
        setIsReimbursedDetailsModalOpen(true);
    };

    const handleExportUnpaidBills = () => {
        const unpaidBills = bills.filter(bill => datePaymentStatus[bill.date] !== 'paid');
        
        // Group bills by the member who paid for them
        const memberCreditors = new Map<string, { member: Member; bills: Bill[] }>();

        unpaidBills.forEach(bill => {
            if (bill.paidBy) {
                const member = membersWithTotals.find(m => m.id === bill.paidBy);
                if (member) {
                    if (!memberCreditors.has(bill.paidBy)) {
                        memberCreditors.set(bill.paidBy, { member, bills: [] });
                    }
                    memberCreditors.get(bill.paidBy)?.bills.push(bill);
                }
            }
        });

        const groups: ExportGroup[] = Array.from(memberCreditors.values())
          .map(({ member, bills }) => {
            let totalAmount = 0;
            const memberBills = bills.map(bill => {
                const billTotal = bill.amount + bill.profit;
                totalAmount += billTotal;
                return {
                    'Date': bill.date,
                    'From': bill.from,
                    'To': bill.to,
                    'Amount': formatCurrency(billTotal),
                };
            });

            return {
                memberName: member.name,
                bills: memberBills,
                totalAmount: totalAmount,
            };
        }).filter(group => group.bills.length > 0);
        
        setExportData(groups);
        setView('export-preview');
    };
    
    const confirmExport = () => {
        const unpaidBills = bills.filter(bill => datePaymentStatus[bill.date] !== 'paid');
        // Format: unpaid-bills-DD-MM-YYYY.csv (using hyphens for file compatibility)
        const dateStr = formatDateToDDMMYYYY(new Date()).replace(/\//g, '-');
        exportUnpaidBillsByMemberToCsv(`unpaid-bills-${dateStr}.csv`, membersWithTotals, unpaidBills);
        setView('home');
    };

    const totalReimbursed = useMemo(() => {
        return bills
            .filter(bill => datePaymentStatus[bill.date] === 'paid')
            .reduce((total, bill) => total + bill.amount + bill.profit, 0);
    }, [bills, datePaymentStatus]);

    const totalPending = useMemo(() => {
        return bills
            .filter(bill => datePaymentStatus[bill.date] !== 'paid')
            .reduce((total, bill) => total + bill.amount + bill.profit, 0);
    }, [bills, datePaymentStatus]);

    // Show loading spinner while loading data
    if (isLoading && isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch (view) {
            case 'members':
                return <Dashboard onBack={() => setView('home')} members={membersWithTotals} bills={bills} onAddMember={handleAddMember} onRemoveMember={handleRemoveMember} onAddSettlement={handleAddSettlement} />;
            case 'bills':
                return <Bills onBack={() => setView('home')} members={membersWithTotals} bills={bills} onAddBill={handleAddBill} onEditBill={handleEditBill} onRemoveBill={handleRemoveBill} onRemoveBillsByDate={handleRemoveBillsByDate} datePaymentStatus={datePaymentStatus} onDateStatusChange={handleDateStatusChange} />;
            case 'profits':
                return <ProfitsDashboard onBack={() => setView('home')} bills={bills} members={membersWithTotals} />;
            case 'costs':
                return <CostsDashboard onBack={() => setView('home')} bills={bills} members={membersWithTotals} />;
            case 'export-preview':
                return <ExportPreview onBack={() => setView('home')} onConfirm={confirmExport} data={exportData} />;
            case 'home':
            default:
                return <HomeDashboard onNavigate={(v) => setView(v)} totalReimbursed={totalReimbursed} totalPending={totalPending} onExportUnpaidBills={handleExportUnpaidBills} onShowPendingDetails={handleShowPendingDetails} onShowReimbursedDetails={handleShowReimbursedDetails} />;
        }
    };
    
    return (
        <div className="min-h-screen">
            <Header onLogout={handleLogout} />
            <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-7xl">
                {renderView()}
            </main>
            <PendingReimbursementsModal 
                isOpen={isPendingDetailsModalOpen}
                onClose={() => setIsPendingDetailsModalOpen(false)}
                data={pendingDetails}
            />
            <ReimbursedDetailsModal 
                isOpen={isReimbursedDetailsModalOpen}
                onClose={() => setIsReimbursedDetailsModalOpen(false)}
                data={reimbursedDetails}
            />
        </div>
    );
};

export default App;