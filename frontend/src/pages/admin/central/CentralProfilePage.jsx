import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, ShieldCheck, Landmark, Mail, MapPin, Award, Clock } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function CentralProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('nlams_token');
        const res = await axios.get(`${API_BASE}/admin/central/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  if (!profile) return <div className="p-8 text-center text-xs text-slate-400">Loading Central Administrator profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/90 rounded-3xl border border-slate-700 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-700 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl border-2 border-amber-400/50">
            CA
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {profile.account_status}
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium">{profile.designation}</p>
            <p className="text-xs text-slate-400">{profile.organization}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Officer Identification</span>
            <p className="text-sm font-bold text-white font-mono">{profile.officer_id}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Official Gov Email</span>
            <p className="text-sm font-bold text-white">{profile.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Jurisdiction Level</span>
            <p className="text-sm font-bold text-indigo-300">{profile.jurisdiction}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-1">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Official Office Address</span>
            <p className="text-sm font-bold text-white">{profile.office}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center space-x-3 text-xs text-indigo-200">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Statutory Authority: Empowered under RFCTLARR Act 2013 and Section 4 DILRMP National Oversight to review, issue directives, and sanction state-level acquisitions.</span>
        </div>
      </div>
    </div>
  );
}
