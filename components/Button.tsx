
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF] text-white font-semibold rounded-lg shadow-md hover:from-[#00a891] hover:to-[#3b7de8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#4F8CFF] transition-all duration-300 transform hover:scale-105"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;