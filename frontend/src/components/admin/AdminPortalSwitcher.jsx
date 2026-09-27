import React, { useState } from 'react';
import { 
  Building2, Building, ShieldCheck, Layers, ArrowRight, Activity, Lock
} from 'lucide-react';
import CentralAdminDashboard from './CentralAdminDashboard';
import StateAdminDashboard from './StateAdminDashboard';
import DistrictAdminDashboard from './DistrictAdminDashboard';
import SecretAdminAuthGate from '../common/SecretAdminAuthGate';

export default function AdminPortalSwitcher({ onSelectProject, onCreateProject }) {
  const [activeLevel, setActiveLevel] = useState('central'); // 'central', 'state', 'district'
  const [unlockedLevels, setUnlockedLevels] = useState({
    central: false,
    state: false,
    district: false
  });

  const handleAuthSuccess = (authData) => {
    setUnlockedLevels(prev => ({
      ...prev,
      [authData.role]: true
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Level Switcher Bar */}
      <div className="bg-[#0b1a30] p-4 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center shadow-xl">
        <div>
          <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Lock className="w-3 h-3 text-red-400" /> RESTRICTED SECRET GOVERNANCE PORTAL
          </span>
          <h2 className="text-xl font-bold font-serif text-white mt-1">
            Protected Multi-Level Administrative Portals
          </h2>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex flex-wrap items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveLevel('central')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeLevel === 'central' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Level 1: Central Admin</span>
          </button>

          <button
            onClick={() => setActiveLevel('state')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeLevel === 'state' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-300" />
            <span>Level 2: State Admin</span>
          </button>

          <button
            onClick={() => setActiveLevel('district')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeLevel === 'district' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Level 3: District Collectorate</span>
          </button>
        </div>
      </div>

      {/* Render Active Level Portal Wrapped in Secret Auth Gate */}
      <SecretAdminAuthGate
        activeLevel={activeLevel}
        currentSession={unlockedLevels[activeLevel]}
        onAuthSuccess={handleAuthSuccess}
      >
        {activeLevel === 'central' && (
          <CentralAdminDashboard onDrillDownProject={onSelectProject} />
        )}

        {activeLevel === 'state' && (
          <StateAdminDashboard onCreateProject={onCreateProject} onSelectProject={onSelectProject} />
        )}

        {activeLevel === 'district' && (
          <DistrictAdminDashboard onSelectProject={onSelectProject} />
        )}
      </SecretAdminAuthGate>
    </div>
  );
}
