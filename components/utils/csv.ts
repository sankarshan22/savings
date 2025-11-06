
import { Bill, Member } from '../../types';

interface CsvRow {
    [key: string]: string | number;
}

const convertToCSV = (data: CsvRow[]): string => {
    if (!data || data.length === 0) {
        return '';
    }
    const replacer = (_key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    const csv = data.map(row => header.map(fieldName => {
        // Use JSON.stringify to handle commas and quotes within the data
        return JSON.stringify(row[fieldName as keyof CsvRow], replacer);
    }).join(','));
    csv.unshift(header.join(','));
    return csv.join('\r\n');
};

export const exportToCsv = (filename: string, data: CsvRow[]) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const escapeCsvCell = (cellData: any): string => {
    const stringValue = cellData === null || cellData === undefined ? '' : String(cellData);
    if (/[",\r\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

export const exportUnpaidBillsByMemberToCsv = (filename: string, allMembers: Member[], unpaidBills: Bill[]) => {
    // Group bills by the member who paid for them
    const memberCreditors = new Map<string, Bill[]>();

    unpaidBills.forEach(bill => {
        if (bill.paidBy) {
            if (!memberCreditors.has(bill.paidBy)) {
                memberCreditors.set(bill.paidBy, []);
            }
            memberCreditors.get(bill.paidBy)?.push(bill);
        }
    });

    let csvContent = '';
    const headers = ['Date', 'From', 'To', 'Amount'];
    
    // Sort members by name for consistent output
    const sortedMemberIds = Array.from(memberCreditors.keys()).sort((a, b) => {
        const memberA = allMembers.find(m => m.id === a);
        const memberB = allMembers.find(m => m.id === b);
        return memberA?.name.localeCompare(memberB?.name || '') || 0;
    });

    sortedMemberIds.forEach(memberId => {
        const memberBills = memberCreditors.get(memberId) || [];
        const member = allMembers.find(m => m.id === memberId);
        
        if (memberBills.length > 0 && member) {
            let memberTotal = 0;
            csvContent += `${escapeCsvCell(member.name)}\r\n`;
            csvContent += headers.map(h => escapeCsvCell(h)).join(',') + '\r\n';
            
            memberBills.forEach(bill => {
                const billTotal = bill.amount + bill.profit;
                memberTotal += billTotal;

                const row = [
                    bill.date,
                    bill.from,
                    bill.to,
                    billTotal.toFixed(2)
                ];

                csvContent += row.map(cell => escapeCsvCell(cell)).join(',') + '\r\n';
            });
            
            const totalRow = ['', '', 'Total', memberTotal.toFixed(2)];
            csvContent += totalRow.map(cell => escapeCsvCell(cell)).join(',') + '\r\n';
            csvContent += '\r\n'; // Spacer row
        }
    });

    if (csvContent === '') {
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
