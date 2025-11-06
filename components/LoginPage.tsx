import React, { useState } from 'react';
import Button from './Button';

interface LoginPageProps {
    onLogin: (loginId: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(loginId, password);
        if (!success) {
            setError('Invalid Login ID or Password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
            <div className="bg-[#1C1C1C] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF] mb-4 sm:mb-6">
                    IYKYK
                </h1>
                <h2 className="text-lg sm:text-xl font-semibold text-center text-white mb-4 sm:mb-6">
                    Admin Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {error && <p className="text-[#FF6B81] bg-[#FF6B81]/10 p-3 rounded-md text-center text-sm">{error}</p>}
                    <div>
                        <label htmlFor="loginId" className="block text-sm font-medium text-[#F2F2F2]">Login ID</label>
                        <input
                            type="text"
                            id="loginId"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2.5 sm:py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] text-base sm:text-sm"
                            placeholder="Enter your Login ID"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#F2F2F2]">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2.5 sm:py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] text-base sm:text-sm"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full py-2.5 sm:py-2">
                            Login
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;