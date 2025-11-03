
import React, { useState, useMemo, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import HomeDashboard from './components/HomeDashboard';
import Bills from './components/Bills';
import ProfitsDashboard from './components/ProfitsDashboard';
import { Member, Bill, ExportGroup, Settlement } from './types';
import { INITIAL_MEMBERS, INITIAL_BILLS } from './constants';
import { exportUnpaidBillsByMemberToCsv } from './utils/csv';
import ExportPreview from './components/ExportPreview';
import CostsDashboard from './components/CostsDashboard';
import Login from './components/Login';
import { supabase } from './supabaseClient';

type View = 'home' | 'members' | 'bills' | 'profits' | 'costs' | 'export-preview';
export type DatePaymentStatus = 'paid' | 'unpaid';

// Get credentials from environment variables
const getAuthCredentials = () => {
  const loginId = import.meta.env.VITE_LOGIN_ID;
  const password = import.meta.env.VITE_LOGIN_PASSWORD;
  
  if (!loginId || !password) {
    console.warn('Missing authentication credentials in environment variables');
    return {};
  }
  
  return { [loginId]: password };
};

const MOCK_USERS = getAuthCredentials();

// This function calculates costs, profits, and debts based on the full list of bills.
const calculateMemberTotals = (baseMembers: Member[], currentBills: Bill[], currentSettlements: Settlement[]): Member[] => {
  // Start with a fresh map of members with totals reset
  const memberMap = new Map<string, Member>(
    baseMembers.map(m => [m.id, { ...m, costs: 0, profits: 0, debts: { owedTo: {}, owedBy: {} }, totalOwed: 0, totalOwedBy: 0 }])
  );

  // Calculate costs on a per-bill basis
  currentBills.forEach(bill => {
    if (bill.amountSharedBy.length > 0) {
      const costPerMember = bill.amount / bill.amountSharedBy.length;
      bill.amountSharedBy.forEach(memberId => {
        const member = memberMap.get(memberId);
        if (member) {
          member.costs += costPerMember;
        }
      });
    }
  });

  // Group bills by date for profit calculation
  const billsByDate = currentBills.reduce((acc, bill) => {
    const dateKey = bill.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(bill);
    return acc;
  }, {} as Record<string, Bill[]>);

  // Calculate and distribute profits on a per-day basis
  Object.values(billsByDate).forEach(dailyBills => {
    const totalDailyProfit = dailyBills.reduce((sum, bill) => sum + bill.profit, 0);
    const involvedMemberIds = [...new Set(dailyBills.flatMap(bill => bill.amountSharedBy))];
    
    if (involvedMemberIds.length > 0) {
      const profitPerMemberForDate = totalDailyProfit / involvedMemberIds.length;
      involvedMemberIds.forEach(memberId => {
        const member = memberMap.get(memberId);
        if (member) {
          member.profits += profitPerMemberForDate;
        }
      });
    }
  });
  
  // Calculate gross debts
  currentBills.forEach(bill => {
    if (bill.amountSharedBy.length > 1 && bill.paidBy) {
      const payerId = bill.paidBy;
      const costPerShare = bill.amount / bill.amountSharedBy.length;
      
      bill.amountSharedBy.forEach(sharerId => {
        if (sharerId !== payerId) {
          const sharer = memberMap.get(sharerId);
          const payer = memberMap.get(payerId);
          if (sharer && payer) {
            sharer.debts.owedTo[payerId] = (sharer.debts.owedTo[payerId] || 0) + costPerShare;
            payer.debts.owedBy[sharerId] = (payer.debts.owedBy[sharerId] || 0) + costPerShare;
          }
        }
      });
    }
  });

  // Apply settlements to adjust gross debts
  currentSettlements.forEach(settlement => {
      const debtor = memberMap.get(settlement.fromMemberId); // The one paying back
      const creditor = memberMap.get(settlement.toMemberId); // The one receiving

      if (debtor && creditor) {
          // Reduce the amount the debtor owes the creditor
          const currentOwedAmount = debtor.debts.owedTo[settlement.toMemberId] || 0;
          const updatedOwedAmount = currentOwedAmount - settlement.amount;
          
          debtor.debts.owedTo[settlement.toMemberId] = updatedOwedAmount;
          creditor.debts.owedBy[settlement.fromMemberId] = updatedOwedAmount;
      }
  });


  // Net debts between pairs of members
  const memberIds = Array.from(memberMap.keys());
  for (let i = 0; i < memberIds.length; i++) {
    for (let j = i + 1; j < memberIds.length; j++) {
      const member1Id = memberIds[i];
      const member2Id = memberIds[j];
      const member1 = memberMap.get(member1Id)!;
      const member2 = memberMap.get(member2Id)!;

      const owedBy1To2 = member1.debts.owedTo[member2Id] || 0;
      const owedBy2To1 = member2.debts.owedTo[member1Id] || 0;

      if (owedBy1To2 > owedBy2To1) {
        const netDebt = owedBy1To2 - owedBy2To1;
        member1.debts.owedTo[member2Id] = netDebt;
        member2.debts.owedBy[member1Id] = netDebt;
        delete member2.debts.owedTo[member1Id];
        delete member1.debts.owedBy[member2Id];
      } else if (owedBy2To1 > owedBy1To2) {
        const netDebt = owedBy2To1 - owedBy1To2;
        member2.debts.owedTo[member1Id] = netDebt;
        member1.debts.owedBy[member2Id] = netDebt;
        delete member1.debts.owedTo[member2Id];
        delete member2.debts.owedBy[member1Id];
      } else if (owedBy1To2 > 0) { // They are equal and non-zero, or both negative from settlements
        delete member1.debts.owedTo[member2Id];
        delete member2.debts.owedTo[member1Id];
        delete member1.debts.owedBy[member2Id];
        delete member2.debts.owedBy[member1Id];
      }
    }
  }

  // Calculate final total owed amounts after netting and cleanup
  memberMap.forEach(member => {
    // Clean up any debts that are zero or less
    Object.keys(member.debts.owedTo).forEach(key => {
        if(member.debts.owedTo[key] <= 0.01) delete member.debts.owedTo[key];
    });
    Object.keys(member.debts.owedBy).forEach(key => {
        if(member.debts.owedBy[key] <= 0.01) delete member.debts.owedBy[key];
    });

    member.totalOwed = Object.values(member.debts.owedTo).reduce((sum, amount) => sum + amount, 0);
    member.totalOwedBy = Object.values(member.debts.owedBy).reduce((sum, amount) => sum + amount, 0);
  });
  
  return Array.from(memberMap.values());
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('home');
  const [baseMembers, setBaseMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [datePaymentStatus, setDatePaymentStatus] = useState<Record<string, DatePaymentStatus>>({});
  const [groupedBillsForExport, setGroupedBillsForExport] = useState<ExportGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication first on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setIsAuthenticated(true);
      setCurrentUser(loggedInUser);
    }
  }, []);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load members
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('*')
          .order('created_at', { ascending: true });

        if (membersError) throw membersError;

        // Load bills
        const { data: billsData, error: billsError } = await supabase
          .from('bills')
          .select('*')
          .order('date', { ascending: false });

        if (billsError) throw billsError;

        // Load settlements
        const { data: settlementsData, error: settlementsError } = await supabase
          .from('settlements')
          .select('*')
          .order('date', { ascending: false });

        if (settlementsError) throw settlementsError;

        // Transform Supabase data to app format
        if (membersData && membersData.length > 0) {
          const transformedMembers: Member[] = membersData.map(m => ({
            id: m.id,
            name: m.name,
            reimbursementAmt: m.reimbursement_amt,
            reimbursedAmt: m.reimbursed_amt,
            costs: 0,
            profits: 0,
            reimbursementHistory: [],
            debts: { owedTo: {}, owedBy: {} },
            totalOwed: 0,
            totalOwedBy: 0,
          }));
          setBaseMembers(transformedMembers);
        }

        if (billsData && billsData.length > 0) {
          const transformedBills: Bill[] = billsData.map(b => ({
            id: b.id,
            date: b.date,
            from: b.from,
            to: b.to,
            reason: b.reason,
            amount: b.amount,
            profit: b.profit,
            amountSharedBy: b.amount_shared_by,
            paidBy: b.paid_by,
          }));
          setBills(transformedBills);
        }

        if (settlementsData && settlementsData.length > 0) {
          const transformedSettlements: Settlement[] = settlementsData.map(s => ({
            id: s.id,
            date: s.date,
            fromMemberId: s.from_member_id,
            toMemberId: s.to_member_id,
            amount: s.amount,
          }));
          setSettlements(transformedSettlements);
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Fallback to empty state if Supabase fails
      } finally {
        setIsLoading(false);
      }
    };

    // Only load data if user is authenticated
    if (isAuthenticated) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const members = useMemo(() => calculateMemberTotals(baseMembers, bills, settlements), [baseMembers, bills, settlements]);

  const dashboardTotals = useMemo(() => {
    let totalReimbursed = 0;
    let totalPending = 0;

    bills.forEach(bill => {
      const status = datePaymentStatus[bill.date];
      const totalBillAmount = bill.amount + bill.profit;

      if (status === 'paid') {
        totalReimbursed += totalBillAmount;
      } else { // Defaults to 'unpaid' if not set
        totalPending += totalBillAmount;
      }
    });

    return { totalReimbursed, totalPending };
  }, [bills, datePaymentStatus]);

  const handleLogin = (loginId: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (MOCK_USERS[loginId as keyof typeof MOCK_USERS] === pass) {
          localStorage.setItem('currentUser', loginId);
          setIsAuthenticated(true);
          setCurrentUser(loginId);
          resolve();
        } else {
          reject(new Error('Invalid Login ID or Password.'));
        }
      }, 500);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleRemoveMember = (id: string) => {
    setBaseMembers(prevMembers => prevMembers.filter(member => member.id !== id));
    // Optional: Also remove this member from any bills they are part of
    const updatedBills = bills.map(bill => ({
      ...bill,
      amountSharedBy: bill.amountSharedBy.filter(memberId => memberId !== id),
    }));
    setBills(updatedBills);
    
    // Delete from Supabase
    supabase.from('members').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting member from Supabase:', error);
    });
  };

  const handleAddMember = async (newMemberData: { name: string }) => {
    const newMember: Member = {
      ...newMemberData,
      id: crypto.randomUUID(),
      reimbursementAmt: 0,
      reimbursedAmt: 0,
      costs: 0,
      profits: 0,
      reimbursementHistory: [],
      debts: { owedTo: {}, owedBy: {} },
      totalOwed: 0,
      totalOwedBy: 0,
    };
    setBaseMembers(prevMembers => [...prevMembers, newMember]);
    
    // Save to Supabase
    const { error } = await supabase.from('members').insert({
      id: newMember.id,
      name: newMember.name,
      reimbursement_amt: newMember.reimbursementAmt,
      reimbursed_amt: newMember.reimbursedAmt,
    });
    
    if (error) {
      console.error('Error saving member to Supabase:', error);
    }
  };

  const handleAddBill = async (newBillData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
        ...newBillData,
        id: crypto.randomUUID(),
    };
    setBills(prevBills => [...prevBills, newBill]);
    
    // Save to Supabase
    const { error } = await supabase.from('bills').insert({
      id: newBill.id,
      date: newBill.date,
      from: newBill.from,
      to: newBill.to,
      reason: newBill.reason,
      amount: newBill.amount,
      profit: newBill.profit,
      amount_shared_by: newBill.amountSharedBy,
      paid_by: newBill.paidBy,
    });
    
    if (error) {
      console.error('Error saving bill to Supabase:', error);
    }
  };
  
  const handleEditBill = async (updatedBill: Bill) => {
    setBills(prevBills => prevBills.map(bill => (bill.id === updatedBill.id ? updatedBill : bill)));
    
    // Update in Supabase
    const { error } = await supabase.from('bills').update({
      date: updatedBill.date,
      from: updatedBill.from,
      to: updatedBill.to,
      reason: updatedBill.reason,
      amount: updatedBill.amount,
      profit: updatedBill.profit,
      amount_shared_by: updatedBill.amountSharedBy,
      paid_by: updatedBill.paidBy,
      updated_at: new Date().toISOString(),
    }).eq('id', updatedBill.id);
    
    if (error) {
      console.error('Error updating bill in Supabase:', error);
    }
  };

  const handleRemoveBill = (id:string) => {
    setBills(prevBills => prevBills.filter(bill => bill.id !== id));
    
    // Delete from Supabase
    supabase.from('bills').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting bill from Supabase:', error);
    });
  };

  const handleRemoveBillsByDate = (date: string) => {
    setBills(prevBills => prevBills.filter(bill => bill.date !== date));
    
    // Delete from Supabase
    supabase.from('bills').delete().eq('date', date).then(({ error }) => {
      if (error) console.error('Error deleting bills by date from Supabase:', error);
    });
  };
  
  const handleDateStatusChange = (date: string, status: DatePaymentStatus) => {
    setDatePaymentStatus(prevStatus => ({
        ...prevStatus,
        [date]: status,
    }));
  };

  const handleAddSettlement = async (newSettlementData: Omit<Settlement, 'id'>) => {
    const newSettlement: Settlement = {
        ...newSettlementData,
        id: crypto.randomUUID(),
    };
    setSettlements(prev => [...prev, newSettlement]);
    
    // Save to Supabase
    const { error } = await supabase.from('settlements').insert({
      id: newSettlement.id,
      date: newSettlement.date,
      from_member_id: newSettlement.fromMemberId,
      to_member_id: newSettlement.toMemberId,
      amount: newSettlement.amount,
    });
    
    if (error) {
      console.error('Error saving settlement to Supabase:', error);
    }
  };

  const handleExportUnpaidBills = () => {
    // A bill is considered unpaid if its date status is not 'paid'
    const unpaidBills = bills.filter(bill => datePaymentStatus[bill.date] !== 'paid');
    
    const involvedMemberIds = [...new Set(unpaidBills.flatMap(b => b.amountSharedBy))];
    const involvedMembers = members
      .filter(m => involvedMemberIds.includes(m.id))
      .sort((a,b) => a.name.localeCompare(b.name));
      
    const dataForExport: ExportGroup[] = involvedMembers.map(member => {
      let totalAmount = 0;
      const memberBills = unpaidBills
        .filter(bill => bill.amountSharedBy.includes(member.id))
        .map(bill => {
          const numSharers = bill.amountSharedBy.length;
          const perMemberAmount = numSharers > 0 ? (bill.amount + bill.profit) / numSharers : 0;
          totalAmount += perMemberAmount;
          return {
            'Date': bill.date,
            'From': bill.from,
            'To': bill.to,
            'Amount': perMemberAmount.toFixed(2),
          };
        });

      return {
        memberName: member.name,
        bills: memberBills,
        totalAmount,
      };
    }).filter(group => group.bills.length > 0);

    if (dataForExport.length === 0) {
      alert('There are no unpaid bills to export.');
      return;
    }
    
    setGroupedBillsForExport(dataForExport);
    setActiveView('export-preview');
  };
  
  const handleConfirmExport = () => {
    const filename = `unpaid-bills-${new Date().toISOString().slice(0, 10)}.csv`;
    const unpaidBills = bills.filter(bill => datePaymentStatus[bill.date] !== 'paid');
    exportUnpaidBillsByMemberToCsv(filename, members, unpaidBills);
    setActiveView('home');
  };

  const handleCancelExport = () => {
    setActiveView('home');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'members':
        return <Dashboard 
                  onBack={() => setActiveView('home')} 
                  members={members}
                  bills={bills}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onAddSettlement={handleAddSettlement}
                />;
      case 'bills':
        return <Bills 
                 onBack={() => setActiveView('home')} 
                 members={members} 
                 bills={bills}
                 onAddBill={handleAddBill}
                 onEditBill={handleEditBill}
                 onRemoveBill={handleRemoveBill}
                 onRemoveBillsByDate={handleRemoveBillsByDate}
                 datePaymentStatus={datePaymentStatus}
                 onDateStatusChange={handleDateStatusChange}
               />;
      case 'profits':
        return <ProfitsDashboard 
                 onBack={() => setActiveView('home')}
                 bills={bills}
                 members={members}
               />;
      case 'costs':
        return <CostsDashboard 
                 onBack={() => setActiveView('home')}
                 bills={bills}
                 members={members}
               />;
      case 'export-preview':
        return <ExportPreview 
                 onBack={handleCancelExport}
                 onConfirm={handleConfirmExport}
                 data={groupedBillsForExport}
               />;
      case 'home':
      default:
        return <HomeDashboard 
                  onNavigate={(view) => setActiveView(view)}
                  totalReimbursed={dashboardTotals.totalReimbursed}
                  totalPending={dashboardTotals.totalPending}
                  onExportUnpaidBills={handleExportUnpaidBills}
                />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00C2A8] mx-auto mb-4"></div>
          <p className="text-[#F2F2F2] text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#F2F2F2] font-sans">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-[#B0B0B0] text-sm">
        <p>© {new Date().getFullYear()} Savings. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
