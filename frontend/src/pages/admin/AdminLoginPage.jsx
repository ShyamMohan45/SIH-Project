import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Landmark, Lock, Mail, Key, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('central.admin@nlams.gov.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('CENTRAL_ADMIN');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      role: 'CENTRAL_ADMIN',
      title: 'Central Administrator',
      subtitle: 'National Control Room & All States',
      email: 'central.admin@nlams.gov.in',
      target: '/admin/central/dashboard'
    },
    {
      role: 'STATE_ADMIN',
      title: 'State Admin (Gujarat)',
      subtitle: 'State Operations Room (Gujarat)',
      email: 'state.gujarat@nlams.gov.in',
      target: '/admin/state/dashboard'
    },
    {
      role: 'FIELD_OFFICER',
      title: 'Field Officer (FO-007)',
      subtitle: 'Revenue Surveyor & Inspections',
      email: 'fo.vikram@nlams.gov.in',
      target: '/portal'
    }
  ];

  const handleSelectPreset = (p) => {
    setSelectedRole(p.role);
    setEmail(p.email);
    setPassword('password123');
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: email.trim(),
        password: password
      });

      const { access_token, user } = res.data;
      localStorage.setItem('nlams_token', access_token);
      localStorage.setItem('nlams_user', JSON.stringify(user));

      // Direct to respective role control room
      if (user.role === 'CENTRAL_ADMIN') {
        navigate('/admin/central/dashboard');
      } else if (user.role === 'STATE_ADMIN' || user.role === 'STATE_OFFICER') {
        navigate('/admin/state/dashboard');
      } else {
        navigate('/portal');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      {/* Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shadow-sm" />

      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center border border-amber-400/40">
            <Landmark className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-base tracking-tight">N-LAMS</span>
              <span className="text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                Secure Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Department of Land Resources &bull; Government of India</p>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center space-x-1"
        >
          <span>&larr; Citizen Transparency Portal</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Government Officer Authentication</h2>
            <p className="text-xs text-slate-400">
              Role-Based Access Control for Central, State, and Field Authorities
            </p>
          </div>

          {/* Quick Preset Selector for Demonstration */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Official Role:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSel = email === p.email;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSel
                        ? 'bg-amber-400/10 border-amber-400/50 text-white shadow-xs'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <p className="font-bold text-[11px] leading-tight truncate">{p.title}</p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{p.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Gov Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Secure Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter Operations Room'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-800">
            Authorized government personnel only. Unauthorized access is punishable under Section 66 of the Information Technology Act.
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-[11px] text-slate-400">
        National Land Acquisition Monitoring System &bull; National Informatics Centre (NIC)
      </footer>
    </div>
  );
}
