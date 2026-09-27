import React from 'react';
import { LayoutDashboard, Map, GitBranch, FileText, AlertTriangle, Users, Calculator, Shield, Layers, Play } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole, onOpenVideo }) {
  const navItems = [
    { id: 'landing', label: 'Home Overview', icon: LayoutDashboard },
    { id: 'dashboard', label: 'National Dashboard', icon: Layers },
    { id: 'workflow', label: 'Single-Window Workflow', icon: GitBranch },
    { id: 'gis', label: 'GIS Cadastral Map', icon: Map },
    { id: 'land_records', label: 'Land Ownership & Valuation', icon: Calculator },
    { id: 'ai_risk', label: 'AI Delay Risk & XAI', icon: AlertTriangle, badge: 'PS17 AI' },
    { id: 'documents', label: 'Gazette Repository', icon: FileText },
  ];

  const roles = [
    { id: 'central', label: 'Central Admin (All India)', scope: 'National' },
    { id: 'state', label: 'State Officer (Gujarat)', scope: 'State Level' },
    { id: 'district', label: 'District Admin (Rajkot)', scope: 'District Level' },
    { id: 'field', label: 'Field Surveyor', scope: 'Parcel Level' }
  ];

  return (
    <div className="bg-[#0b2545] text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center py-2 gap-2">
        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Video Launcher & RBAC Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Watch Video Demo Button */}
          {onOpenVideo && (
            <button
              onClick={onOpenVideo}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Watch Video</span>
            </button>
          )}

          {/* Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-slate-800 text-white text-xs font-semibold rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 border border-slate-600 cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
