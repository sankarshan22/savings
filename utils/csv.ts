
import { Bill, Member } from '../types';

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
    const involvedMemberIds = [...new Set(unpaidBills.flatMap(b => b.amountSharedBy))];
    const involvedMembers = allMembers
        .filter(m => involvedMemberIds.includes(m.id))
        .sort((a,b) => a.name.localeCompare(b.name));

    let csvContent = '';
    const headers = ['Date', 'From', 'To', 'Amount'];
    
    involvedMembers.forEach(member => {
        const memberBills = unpaidBills.filter(bill => bill.amountSharedBy.includes(member.id));
        
        if (memberBills.length > 0) {
            let memberTotal = 0;
            csvContent += `${escapeCsvCell(member.name)}\r\n`;
            csvContent += headers.map(h => escapeCsvCell(h)).join(',') + '\r\n';
            
            memberBills.forEach(bill => {
                const numSharers = bill.amountSharedBy.length;
                const perMemberAmount = numSharers > 0 ? (bill.amount + bill.profit) / numSharers : 0;
                memberTotal += perMemberAmount;

                const row = [
                    bill.date,
                    bill.from,
                    bill.to,
                    perMemberAmount.toFixed(2)
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
