import React, { useState, useEffect } from 'react';
import {
  Home,
  ClipboardList,
  Map as MapIcon,
  Clock,
  User,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  ShieldCheck
} from 'lucide-react';
import { offlineStorage } from '../../services/offlineStorage';
import { nativeService } from '../../services/nativeService';

export default function FieldLayout({
  activeTab = 'home',
  onTabChange,
  children,
  officer = { name: 'Amit B. Parmar', officer_id: 'FO-007' },
  onSyncNow
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(offlineStorage.getPendingCount());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial network status
    nativeService.getNetworkStatus().then((status) => {
      setIsOnline(status.connected);
    });

    // Native & browser network listener
    const cleanupNetwork = nativeService.onNetworkChange((connected) => {
      setIsOnline(connected);
    });

    const interval = setInterval(() => {
      setPendingCount(offlineStorage.getPendingCount());
    }, 2000);

    return () => {
      cleanupNetwork();
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (onSyncNow) {
      setIsSyncing(true);
      await onSyncNow();
      setIsSyncing(false);
      setPendingCount(offlineStorage.getPendingCount());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between select-none max-w-md mx-auto border-x border-slate-200 shadow-xl relative">
      {/* 1. TOP OFFICIAL GOVERNMENT HEADER */}
      <header className="bg-gov-900 text-white sticky top-0 z-40 shadow-md">
        {/* Government Strip */}
        <div className="bg-slate-950 px-3.5 py-1 text-[10px] text-slate-300 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-semibold tracking-wider uppercase">Govt of India • MoRD • DoLR</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>SIH-26016</span>
          </div>
        </div>

        {/* App Title & Officer Badge Bar */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gov-800 border border-gov-700 flex items-center justify-center text-sky-300 shadow">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-sm tracking-tight text-white">N-LAMS Field</h1>
                <span className="text-[9px] font-mono bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-bold">
                  2.4 PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium">Ground Verification Inspection</p>
            </div>
          </div>

          {/* Sync & Connectivity Indicator */}
          <div className="flex items-center gap-1.5">
            {isOnline ? (
              <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline</span>
              </span>
            )}

            {/* Sync Pill */}
            {pendingCount > 0 ? (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync ({pendingCount})</span>
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                ✓ Synced
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 2. SCROLLABLE MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* 3. MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 z-40 shadow-lg px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'home' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
            activeTab === 'tasks' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tasks</span>
          <span className="absolute -top-0.5 right-1 w-4 h-4 bg-gov-700 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            5
          </span>
        </button>

        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'map' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'history' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">History</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-gov-800 font-bold bg-blue-50' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
