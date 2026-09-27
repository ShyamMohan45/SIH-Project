import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldAlert, Key, UserPlus, CheckCircle2, AlertCircle,
  ShieldCheck, User, Mail, ArrowRight, Eye, EyeOff
} from 'lucide-react';

export default function SecretAdminAuthGate({ children, activeLevel, onAuthSuccess, currentSession }) {
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  const [isUnlocked, setIsUnlocked] = useState(currentSession ? true : false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Authorized Official Accounts per level
  const authorizedAccounts = {
    central: {
      email: 'central.admin@mord.gov.in',
      password: 'CentralAdmin#2026!'
    },
    state: {
      email: 'state.nodal@gujarat.gov.in',
      password: 'GujaratState#2026!'
    },
    district: {
      email: 'collector.rajkot@nic.in',
      password: 'RajkotCollector#2026!'
    }
  };

  // State to store custom registered users
  const [registeredAccounts, setRegisteredAccounts] = useState([]);

  // Form Inputs - Kept empty for strict confidentiality
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Reset form & errors whenever switching admin levels
  useEffect(() => {
    setLoginEmail('');
    setLoginPassword('');
    setErrorMessage('');
    setIsUnlocked(currentSession ? true : false);
  }, [activeLevel, currentSession]);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regServiceId, setRegServiceId] = useState('');
  const [regRole, setRegRole] = useState(activeLevel);
  const [regState, setRegState] = useState('Gujarat');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState(false);

  // If unlocked, render protected dashboard
  if (isUnlocked) {
    return (
      <div>
        {/* Protected Session Status Bar */}
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-2 rounded-xl mb-4 text-xs font-bold flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTICATED ACCESS UNLOCKED • Session Verified ({loginEmail || 'Authorized Officer'})</span>
          </div>
          <button
            onClick={() => {
              setIsUnlocked(false);
              setLoginEmail('');
              setLoginPassword('');
            }}
            className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded flex items-center gap-1 font-bold transition-colors"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Lock Admin Portal</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const defaultAcc = authorizedAccounts[activeLevel];
    const customUser = registeredAccounts.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() && 
           u.role === activeLevel &&
           u.password === loginPassword
    );

    // Check credentials against secret default accounts or registered custom accounts
    const isAuthorized = 
      (loginEmail.trim().toLowerCase() === defaultAcc.email.toLowerCase() && loginPassword === defaultAcc.password) ||
      !!customUser;

    if (isAuthorized) {
      setIsUnlocked(true);
      if (onAuthSuccess) {
        onAuthSuccess({
          email: loginEmail,
          role: activeLevel,
          authenticated: true
        });
      }
    } else {
      setErrorMessage(
        `Access Denied: Invalid credentials for ${activeLevel.toUpperCase()} Level. Please check your official Email and Secret Password, or Register a new account.`
      );
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: regName,
      serviceId: regServiceId,
      email: regEmail.trim(),
      role: regRole,
      state: regState,
      password: regPassword
    };

    setRegisteredAccounts(prev => [...prev, newUser]);
    setRegSuccessMsg(true);

    setTimeout(() => {
      setAuthMode('LOGIN');
      setLoginEmail(newUser.email);
      setLoginPassword('');
      setRegSuccessMsg(false);
      setErrorMessage('');
    }, 1200);
  };

  return (
    <div className="bg-[#0b1a30] rounded-2xl p-6 shadow-2xl border border-slate-800 text-slate-100 max-w-xl mx-auto my-6">
      {/* Header Lock Icon */}
      <div className="text-center space-y-2 pb-5 border-b border-slate-800">
        <div className="w-14 h-14 bg-red-950/80 border border-red-800 text-red-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <Lock className="w-7 h-7 animate-pulse" />
        </div>
        <div className="inline-block bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
          RESTRICTED SECRET ADMIN ZONE • AUTHORIZED PERSONNEL ONLY
        </div>
        <h3 className="text-xl font-bold font-serif text-white">
          Government Authentication Gate ({activeLevel.toUpperCase()} LEVEL)
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Confidential government data repository. Enter authorized official credentials or register below to gain access.
        </p>
      </div>

      {/* Auth Mode Switcher */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 my-5 text-xs font-bold">
        <button
          onClick={() => {
            setAuthMode('LOGIN');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'LOGIN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Official Officer Login</span>
        </button>

        <button
          onClick={() => {
            setAuthMode('REGISTER');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'REGISTER' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register Officer Account</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 bg-red-950/90 border border-red-800 p-3 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MODE 1: LOGIN FORM */}
      {authMode === 'LOGIN' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Official Government Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="officer.name@nic.in"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Secret Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter confidential password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-9 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>AUTHENTICATE & UNLOCK {activeLevel.toUpperCase()} PORTAL</span>
            </button>
          </div>
        </form>
      )}

      {/* MODE 2: REGISTRATION FORM */}
      {authMode === 'REGISTER' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
          {regSuccessMsg && (
            <div className="bg-emerald-950 border border-emerald-800 p-3 rounded-xl text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Registration Successful! Officer Credentials Registered. Redirecting to Login...</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Officer Full Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Sharma"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Govt. Service / Officer ID</label>
              <input
                type="text"
                placeholder="e.g. IAS-GJ-2014-042"
                value={regServiceId}
                onChange={(e) => setRegServiceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Official Government Email</label>
            <input
              type="email"
              placeholder="officer.name@nic.in"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Admin Level Registration</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              >
                <option value="central">Level 1: Central Admin</option>
                <option value="state">Level 2: State Admin</option>
                <option value="district">Level 3: District Collectorate</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">State Jurisdiction</label>
              <select
                value={regState}
                onChange={(e) => setRegState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              >
                <option value="Gujarat">Gujarat State</option>
                <option value="Maharashtra">Maharashtra State</option>
                <option value="Rajasthan">Rajasthan State</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Create Confidential Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>REGISTER OFFICER CREDENTIALS</span>
          </button>
        </form>
      )}
    </div>
  );
}
