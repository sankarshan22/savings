import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-[#1C1C1C]/50 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex justify-between items-center max-w-7xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF]">
          IYKYK
        </h1>
        <button 
            onClick={onLogout} 
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#3C3C3C] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#5A5A5A] active:bg-[#5A5A5A] transition-colors"
        >
            Logout
        </button>
      </div>
    </header>
  );
};

export default Header;