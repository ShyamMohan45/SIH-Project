import React, { useState } from 'react';
import { User, Shield, Phone, Mail, MapPin, RefreshCw, Globe, LogOut, Check, Server } from 'lucide-react';
import { offlineStorage } from '../services/offlineStorage';
import { getBaseUrl } from '../services/api';

export default function ProfilePage({ officer, onLogout, onSyncNow }) {
  const [lang, setLang] = useState('en');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const [serverUrl, setServerUrl] = useState(() => localStorage.getItem('nlams_server_url') || getBaseUrl());
  const [serverSaved, setServerSaved] = useState(false);

  const handleSaveServerUrl = () => {
    if (serverUrl.trim()) {
      localStorage.setItem('nlams_server_url', serverUrl.trim());
      setServerSaved(true);
      setTimeout(() => setServerSaved(false), 3000);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    if (onSyncNow) {
      await onSyncNow();
      setSyncMsg('All local drafts synced with N-LAMS Central Server!');
      setTimeout(() => setSyncMsg(null), 4000);
    }
    setSyncing(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Officer ID Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-gov-800 text-sky-300 mx-auto flex items-center justify-center text-xl font-bold border-4 border-slate-100 shadow">
          FO
        </div>
        <h2 className="text-base font-black text-slate-900 mt-2">{officer?.name || 'Amit B. Parmar'}</h2>
        <span className="text-xs font-mono font-bold bg-blue-50 text-gov-800 px-2.5 py-0.5 rounded-full border border-blue-200 mt-1 inline-block">
          {officer?.officer_id || 'FO-007'}
        </span>
        <p className="text-xs text-slate-500 mt-1">
          Cadastral Survey & Ground Verification Wing
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>District: <strong>Surendranagar</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>State: <strong>Gujarat</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate">field.surveyor@nlams.gov.in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>+91 98250 44102</span>
          </div>
        </div>
      </div>

      {/* Sync Management */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Sync & Offline Data</h3>
        <p className="text-xs text-slate-500">
          Manage local draft caches when working in rural areas with low network bandwidth.
        </p>

        {syncMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{syncMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-600">Pending Drafts: <strong>{offlineStorage.getPendingCount()}</strong></span>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Backend Server URL Config */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Server className="w-4 h-4 text-slate-500" />
          <span>Backend Server IP (Mobile LAN)</span>
        </h3>
        <p className="text-[11px] text-slate-500">
          Set your laptop/LAN IP (e.g. <code>http://192.168.0.117:8000/api</code>) so the mobile app can sync live data with Central N-LAMS.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://192.168.0.117:8000/api"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-700"
          />
          <button
            type="button"
            onClick={handleSaveServerUrl}
            className="px-3.5 py-2 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95"
          >
            {serverSaved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-slate-500" />
          <span>Language Support</span>
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setLang('en')}
            className={`py-2 rounded-xl border transition ${
              lang === 'en' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`py-2 rounded-xl border transition ${
              lang === 'hi' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => setLang('gu')}
            className={`py-2 rounded-xl border transition ${
              lang === 'gu' ? 'bg-gov-800 text-white border-gov-800' : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            ગુજરાતી (Gujarati)
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-2xl border border-red-200 transition shadow-sm flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>LOGOUT FROM FIELD DEVICE</span>
      </button>
    </div>
  );
}
