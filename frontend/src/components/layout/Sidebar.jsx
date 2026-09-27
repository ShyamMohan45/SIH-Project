import React from 'react';
import { 
  LayoutDashboard, FolderCheck, Map, GitBranch, Grid, ClipboardCheck, 
  Cpu, DollarSign, Gavel, Home, FileText, Bell, Sparkles, 
  BarChart3, History, ShieldCheck, Settings, LogOut, ChevronRight
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  userSession, 
  onLogout 
}) {
  const navSections = [
    {
      groupTitle: 'OPERATIONAL CONTROL',
      items: [
        { id: 'dashboard', label: 'Control Room Overview', icon: LayoutDashboard, badge: null },
        { id: 'projects', label: 'Projects Directory', icon: FolderCheck, badge: '10' },
        { id: 'gis', label: 'Operational GIS Studio', icon: Map, badge: 'LIVE' },
        { id: 'workflow', label: 'Statutory Lifecycle', icon: GitBranch, badge: '10 STAGES' },
        { id: 'parcels', label: 'Cadastral Parcels', icon: Grid, badge: '52' },
      ]
    },
    {
      groupTitle: 'GROUND TRUTH & AI INTELLIGENCE',
      items: [
        { id: 'field_inspections', label: 'Field Inspection Cell', icon: ClipboardCheck, badge: 'GROUND' },
        { id: 'ai_risk', label: 'AI Delay Risk (PS17)', icon: Cpu, badge: 'SHAP ML' },
        { id: 'alerts', label: 'Early Warning Alerts', icon: Bell, badge: '6' },
        { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'CLOSED LOOP' },
      ]
    },
    {
      groupTitle: 'STATUTORY COMPLIANCE & FINANCE',
      items: [
        { id: 'compensation', label: 'Compensation & PFMS', icon: DollarSign, badge: null },
        { id: 'legal', label: 'Legal & Objections', icon: Gavel, badge: '18 CASES' },
        { id: 'rr', label: 'R&R Compliance', icon: Home, badge: 'SCH-II' },
        { id: 'documents', label: 'Document Integrity Vault', icon: FileText, badge: 'SHA-256' },
      ]
    },
    {
      groupTitle: 'GOVERNANCE & PLATFORM',
      items: [
        { id: 'reports', label: 'Reports & Export', icon: BarChart3, badge: 'CSV/PDF' },
        { id: 'audit', label: 'Audit Trail Logs', icon: History, badge: 'IMMUTABLE' },
        { id: 'rbac', label: 'Stakeholder Matrix', icon: ShieldCheck, badge: 'RBAC' },
        { id: 'settings', label: 'Gateways & Settings', icon: Settings, badge: 'GATEWAY' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0b2545] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800 shadow-md">
      {/* Scrollable Navigation Area */}
      <div className="overflow-y-auto py-3 px-2.5 space-y-4">
        {navSections.map((section, sidx) => (
          <div key={sidx}>
            <div className="px-2.5 pb-1.5 text-[9px] font-black text-slate-400 tracking-wider uppercase">
              {section.groupTitle}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.8 rounded-lg text-xs font-semibold transition-all group ${
                      isActive 
                        ? 'bg-blue-600 text-white font-bold shadow-xs' 
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.8 h-3.8 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                      }`} />
                      <span className="truncate text-[11.5px]">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 uppercase tracking-tighter ${
                        isActive 
                          ? 'bg-blue-800 text-blue-100' 
                          : item.badge === 'LIVE' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                            : item.badge === 'SHAP ML'
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom User Profile Card & Jurisdiction */}
      <div className="p-3 border-t border-slate-800/90 bg-[#081b33]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-blue-700/80 text-white flex items-center justify-center text-xs font-black shrink-0 border border-blue-400">
              {userSession.name ? userSession.name.charAt(0) : 'U'}
            </div>
            <div className="truncate text-left leading-tight">
              <div className="text-[11px] font-bold text-white truncate">{userSession.name || 'Official Officer'}</div>
              <div className="text-[9px] text-blue-300 truncate">{userSession.roleTitle}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            title="Switch / Logout" 
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded text-[10px] text-slate-400 flex items-center justify-between">
          <span className="truncate font-mono">Scope: {userSession.state}</span>
          <span className="text-[9px] text-emerald-400 font-bold">● Active</span>
        </div>
      </div>
    </aside>
  );
}
