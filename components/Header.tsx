
import React from 'react';
import { UserCircleIcon, LogoutIcon } from './icons/Icons';

interface HeaderProps {
  currentUser: string | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-[#1C1C1C]/50 backdrop-blur-sm shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF]">
            IYKYK
            </h1>
        </div>
        <div className="flex-1 flex justify-end items-center gap-4">
            {currentUser && (
                <div className="flex items-center gap-2 text-[#D9D9D9]">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="font-semibold">{currentUser}</span>
                </div>
            )}
            <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#3C3C3C] text-white font-semibold rounded-lg hover:bg-[#5A5A5A] transition-colors"
                aria-label="Logout"
            >
                <LogoutIcon className="w-5 h-5"/>
                Logout
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
