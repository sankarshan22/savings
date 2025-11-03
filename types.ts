export interface Reimbursement {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface Settlement {
  id: string;
  date: string;
  fromMemberId: string; // The person who is paying back (debtor)
  toMemberId: string;   // The person who is receiving the payment (creditor)
  amount: number;
}

export interface Member {
  id:string;
  name: string;
  reimbursementAmt: number;
  reimbursedAmt: number;
  costs: number;
  profits: number;
  reimbursementHistory: Reimbursement[];
  debts: {
    owedTo: Record<string, number>; // key: memberId, value: amount
    owedBy: Record<string, number>; // key: memberId, value: amount
  };
  totalOwed: number;
  totalOwedBy: number;
}

export interface Bill {
  id: string;
  date: string;
  from: string;
  to: string;
  reason: string;
  amount: number;
  profit: number;
  amountSharedBy: string[]; // Array of member IDs
  paidBy: string; // ID of the member who paid
}

export interface ExportBill {
  'Date': string;
  'From': string;
  'To': string;
  'Amount': string;
}

export interface ExportGroup {
  memberName: string;
  bills: ExportBill[];
  totalAmount: number;
}