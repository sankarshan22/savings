import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { DownloadIcon } from './icons/Icons';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: Array<Record<string, any>>;
}

const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="p-2">
        <h2 className="text-2xl font-bold text-white mb-4">Export Preview</h2>
        <p className="text-slate-400 mb-6">
          Review the data below. This is how it will appear in the exported CSV file.
        </p>

        <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-slate-700">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50 sticky top-0 backdrop-blur-sm">
              <tr>
                {headers.map(header => (
                  <th key={header} scope="col" className="px-6 py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                  {headers.map(header => (
                    <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap">
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors">
            Cancel
          </button>
          <Button onClick={onConfirm}>
            <DownloadIcon className="w-5 h-5 mr-2" />
            Confirm & Download
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportPreviewModal;
