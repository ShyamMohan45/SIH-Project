import React, { useState } from 'react';
import { ShieldCheck, Building, User, Lock, ArrowRight, CheckCircle2, MapPin, X } from 'lucide-react';

export default function RbacLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [orgType, setOrgType] = useState('State Government');
  const [department, setDepartment] = useState('Revenue & Land Acquisition Department');
  const [state, setState] = useState('Gujarat');
  const [district, setDistrict] = useState('Rajkot');
  const [username, setUsername] = useState('officer.gujarat@nlams.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      onLoginSuccess({
        orgType,
        department,
        state: orgType === 'Central Government' ? 'All India' : state,
        district: orgType === 'District Administration' ? district : 'All Districts',
        username,
        roleTitle: orgType === 'Central Government' 
          ? 'Central Admin Officer' 
          : orgType === 'State Government' 
          ? 'State Acquisition Nodal' 
          : orgType === 'District Administration'
          ? 'District Collector / Magistrate'
          : 'Field Survey Officer'
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1a30] text-slate-100 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-[#0b2545] p-6 border-b border-slate-800 text-center">
          <div className="w-12 h-14 bg-amber-50 rounded-lg border border-amber-300 mx-auto flex flex-col items-center justify-center p-1 shadow-md mb-2">
            <ShieldCheck className="w-7 h-7 text-[#0b2545]" />
            <span className="text-[7px] font-black text-amber-900 uppercase tracking-tighter">Satyameva Jayate</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif tracking-tight">N-LAMS</h2>
          <p className="text-xs text-blue-200 font-semibold">National Land Acquisition & Management System</p>
          <div className="inline-block mt-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Secure Unified Government Portal Access
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Organization Type</label>
            <div className="relative">
              <select
                value={orgType}
                onChange={(e) => {
                  setOrgType(e.target.value);
                  if (e.target.value === 'Central Government') {
                    setDepartment('Ministry of Rural Development / DoLR');
                  } else if (e.target.value === 'State Government') {
                    setDepartment('Revenue & Land Acquisition Department');
                  } else if (e.target.value === 'District Administration') {
                    setDepartment('District Revenue Collectorate');
                  } else {
                    setDepartment('Field Survey & Verification Cell');
                  }
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
              >
                <option value="Central Government">Central Government (Ministry Level)</option>
                <option value="State Government">State Government (State Level)</option>
                <option value="District Administration">District Administration (Collectorate)</option>
                <option value="Field Officer">Field Officer (Mobile Survey Cell)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Ministry / Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">State Jurisdiction</label>
              <select
                value={state}
                disabled={orgType === 'Central Government'}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium disabled:opacity-50"
              >
                <option value="Gujarat">Gujarat State</option>
                <option value="Maharashtra">Maharashtra State</option>
                <option value="Rajasthan">Rajasthan State</option>
                <option value="Karnataka">Karnataka State</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">District Jurisdiction</label>
              <select
                value={district}
                disabled={orgType === 'Central Government' || orgType === 'State Government'}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium disabled:opacity-50"
              >
                <option value="Rajkot">Rajkot District</option>
                <option value="Surendranagar">Surendranagar District</option>
                <option value="Ahmedabad">Ahmedabad District</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Government Official Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoggingIn ? (
                <span>Authenticating Official Credentials...</span>
              ) : (
                <>
                  <span>LOGIN TO UNIFIED GOVERNMENT PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-800">
            RBAC Access Control Active • Single-Sign-On (SSO) integrated with e-Gov National Directory
          </p>
        </form>
      </div>
    </div>
  );
}
