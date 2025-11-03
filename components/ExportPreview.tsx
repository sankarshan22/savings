
import React from 'react';
import Button from './Button';
import { DownloadIcon, ChevronLeftIcon } from './icons/Icons';
import { ExportGroup } from '../types';
import { formatCurrency } from '../utils/currency';

interface ExportPreviewProps {
  onBack: () => void;
  onConfirm: () => void;
  data: ExportGroup[];
}

const ExportPreview: React.FC<ExportPreviewProps> = ({ onBack, onConfirm, data }) => {
  if (data.length === 0) {
    // This case should ideally be handled before navigating here, but as a fallback:
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-[#F2F2F2]">No Data to Preview</h2>
        <p className="text-[#D9D9D9] mt-2">There are no unpaid bills to export.</p>
        <div className="mt-8">
            <Button onClick={onBack}>
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Go Back
            </Button>
        </div>
      </div>
    );
  }

  const headers = ['Date', 'From', 'To', 'Amount'];

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack} 
                    className="p-2 rounded-full bg-[#1C1C1C] text-[#D9D9D9] hover:bg-[#2E2E2E] hover:text-[#F2F2F2] transition-colors"
                    aria-label="Go back"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-[#F2F2F2]">
                    Export Preview
                </h2>
            </div>
            <Button onClick={onConfirm}>
                <DownloadIcon className="w-5 h-5 mr-2" />
                Confirm & Download
            </Button>
        </div>

        <p className="text-[#D9D9D9] mb-6">
          Review the data below. This will be exported as separate tables for each member in the CSV file.
        </p>

        <div className="space-y-8">
          {data.map((group) => (
            <div key={group.memberName}>
              <h3 className="text-xl font-semibold text-[#00C2A8] mb-3">{group.memberName}</h3>
              <div className="rounded-lg border border-[#2E2E2E] bg-[#1C1C1C] shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-[#F2F2F2]">
                  <thead className="text-xs text-[#D9D9D9] uppercase bg-[#2E2E2E]/50">
                    <tr>
                      {headers.map(header => (
                        <th key={header} scope="col" className="px-6 py-3 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.bills.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-[#2E2E2E] last:border-b-0 hover:bg-[#2E2E2E]/50 transition-colors">
                        {headers.map(header => (
                          <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap">
                            {String(row[header as keyof typeof row])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#3C3C3C] bg-[#1C1C1C] font-bold">
                      <td colSpan={3} className="px-6 py-3 text-right text-[#F2F2F2] uppercase tracking-wider">
                        Total
                      </td>
                      <td className="px-6 py-3 text-[#00C2A8] whitespace-nowrap">
                        {formatCurrency(group.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ExportPreview;