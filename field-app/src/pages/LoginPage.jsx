import React, { useState } from 'react';
import { Shield, KeyRound, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('FO-007');
  const [password, setPassword] = useState('Gov#Secure2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid government officer credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPreset = () => {
    setEmail('FO-007');
    setPassword('Gov#Secure2026');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-sky-600/20 blur-3xl pointer-events-none"></div>

      {/* Official Government Identity Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gov-800 border border-gov-700 shadow-2xl mb-3 text-sky-400">
          <Shield className="w-8 h-8 text-sky-400" />
        </div>
        <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-1">
          Government of India • Ministry of Rural Development
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">N-LAMS Field</h1>
        <p className="text-xs font-semibold text-sky-200 mt-1">
          Ground Verification & Land Acquisition Inspection
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 relative z-10">
        <div className="mb-4 pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Officer Authentication</h2>
          <p className="text-xs text-slate-500">Authorized Cadastral Surveyors & Revenue Staff</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Officer ID / Official Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. FO-007 or field.surveyor@nlams.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'LOGIN TO FIELD SYSTEM'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* SIH Fast Demo Fill Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoPreset}
            className="text-[11px] font-bold text-gov-700 hover:text-gov-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm"
          >
            ⚡ Fast Fill Demo: Field Officer (FO-007)
          </button>
        </div>
      </div>

      {/* Synthetic Data Disclaimer */}
      <div className="mt-6 text-center text-[10px] text-slate-400 leading-relaxed z-10">
        <span className="font-bold text-slate-300">NOTICE:</span> DEMO / SYNTHETIC DATA FOR SIH GROUND TRUTHING EVALUATION.
      </div>
    </div>
  );
}
