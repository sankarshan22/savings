
import React from 'react';
import { CloseIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-[#1C1C1C] rounded-lg shadow-xl w-full p-4 sm:p-6 relative ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#B0B0B0] hover:text-[#F2F2F2] transition-colors z-10 bg-[#2E2E2E] rounded-full p-1"
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;