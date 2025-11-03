
import React, { useState } from 'react';
import Button from './Button';

interface LoginProps {
  onLogin: (loginId: string, pass: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter both Login ID and Password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onLogin(loginId, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C2A8] to-[#4F8CFF]">
            IYKYK
            </h1>
            <p className="text-[#B0B0B0] mt-2">Please sign in to continue</p>
        </div>
        
        <form 
            onSubmit={handleSubmit} 
            className="bg-[#1C1C1C] p-8 rounded-lg shadow-2xl space-y-6"
        >
            {error && <p className="text-[#FF6B81] bg-[#FF6B81]/10 p-3 rounded-md text-center">{error}</p>}
            
            <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-[#F2F2F2]">Login ID</label>
                <input
                    type="text"
                    id="loginId"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                    placeholder="e.g. admin"
                    disabled={isLoading}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F2F2F2]">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
                    placeholder="e.g. password"
                    disabled={isLoading}
                />
            </div>
          
            <Button type="submit" disabled={isLoading} style={{ width: '100%', height: '48px' }}>
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    'Login'
                )}
            </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
