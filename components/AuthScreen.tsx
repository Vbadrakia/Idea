import React, { useState } from 'react';
import { User } from '../types';
import { login, register } from '../services/authService';
import { ArrowLeft, Loader2, Mail, Lock, User as UserIcon, Building } from 'lucide-react';

interface AuthScreenProps {
  role: 'candidate' | 'recruiter';
  onLogin: (user: User) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ role, onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user: User;
      if (isRegister) {
        if (!name || !email || !password || (role === 'recruiter' && !company)) {
            throw new Error("Please fill in all fields.");
        }
        user = await register(name, email, role, company);
      } else {
        if (!email || !password) {
            throw new Error("Please enter email and password.");
        }
        // Mock password check is implicit in mock service for simplicity, 
        // in real app would verify hash.
        user = await login(email, role);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const isRecruiter = role === 'recruiter';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`p-6 ${isRecruiter ? 'bg-blue-600' : 'bg-indigo-600'} text-white relative`}>
          <button 
            onClick={onBack}
            className="absolute left-4 top-6 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center mt-2">
            <h2 className="text-2xl font-bold">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {isRecruiter ? 'Recruiter Portal' : 'Candidate Portal'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {isRegister && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {isRegister && isRecruiter && (
               <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    placeholder="Tech Corp"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  placeholder={isRecruiter ? "john@company.com" : "you@example.com"}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-6 ${
                isRecruiter 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{' '}
              <button 
                onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                }}
                className={`font-semibold hover:underline ${isRecruiter ? 'text-blue-600' : 'text-indigo-600'}`}
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
          
           {!isRegister && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-400 text-center border border-gray-100">
                <span className="font-semibold">Demo Credentials:</span><br/>
                {role === 'candidate' ? 'alex@example.com' : 'john@techflow.com'} / any password
            </div>
           )}
        </div>
      </div>
    </div>
  );
};