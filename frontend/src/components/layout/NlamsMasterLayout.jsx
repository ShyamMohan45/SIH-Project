import React, { useState } from 'react';
import {
  LayoutDashboard, Map, GitBranch, FileText, BarChart3, Bell, HelpCircle, LogOut,
  ChevronDown, ShieldCheck, User, FolderCheck, DollarSign, Home, Activity, Cpu,
  Layers, Server, Play, Lock, Building2, Settings, History
} from 'lucide-react';
import GISFullMapView from '../gis/GISFullMapView';
import FamilyTreeModal from '../land_records/FamilyTreeModal';
import NationalOverview from '../dashboard/NationalOverview';
import SingleWindowTracker from '../workflow/SingleWindowTracker';
import AIRiskPanel from '../ai_risk/AIRiskPanel';
import LandingPage from '../../pages/LandingPage';
import SystemArchitecture from '../architecture/SystemArchitecture';
import StatutoryLifecycle from '../workflow/StatutoryLifecycle';
import StakeholderMatrix from '../rbac/StakeholderMatrix';
import ProblemLevelSwitcher from '../dashboard/ProblemLevelSwitcher';
import ClosedLoopGovernanceDemo from '../dashboard/ClosedLoopGovernanceDemo';
import RbacLoginModal from '../common/RbacLoginModal';
import AdminPortalSwitcher from '../admin/AdminPortalSwitcher';

// Dedicated New Pages
import ProjectsPage from '../../pages/ProjectsPage';
import ProjectDetailPage from '../../pages/ProjectDetailPage';
import CompensationPage from '../../pages/CompensationPage';
import RRPage from '../../pages/RRPage';
import AnalyticsPage from '../../pages/AnalyticsPage';
import AlertsPage from '../../pages/AlertsPage';
import AuditLogsPage from '../../pages/AuditLogsPage';
import SettingsPage from '../../pages/SettingsPage';

export default function NlamsMasterLayout() {
  const [activeTab, setActiveTab] = useState('admin'); // Default to Multi-Level Admin Portals
  const [selectedProjectId, setSelectedProjectId] = useState('NH-GJ-2026-001');
  const [selectedState, setSelectedState] = useState('Gujarat State');
  const [selectedParcelForTree, setSelectedParcelForTree] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userSession, setUserSession] = useState({
    orgType: 'State Government',
    department: 'Revenue & Land Acquisition Department',
    state: 'Gujarat State',
    district: 'All Districts',
    username: 'officer.gujarat@nlams.gov.in',
    roleTitle: 'State Acquisition Nodal'
  });

  const mainMenuItems = [
    { id: 'admin', label: 'Multi-Level Admin Portals', icon: Building2, badge: '3 LEVELS' },
    { id: 'demo', label: '10-Step Governance Demo', icon: Play, badge: 'KILLER DEMO' },
    { id: 'dashboard', label: 'National Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Directory', icon: FolderCheck },
    { id: 'gis', label: 'GIS Map Studio', icon: Map },
    { id: 'lifecycle', label: 'Statutory Lifecycle', icon: GitBranch },
    { id: 'compensation', label: 'Compensation & PFMS', icon: DollarSign },
    { id: 'rr', label: 'R&R Compliance', icon: Home },
    { id: 'alerts', label: 'AI Delay Alerts', icon: Bell, badge: 5 },
    { id: 'analytics', label: 'Workflow Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Document Vault', icon: FileText },
    { id: 'audit', label: 'Audit Trail Logs', icon: History },
  ];

  const systemMenuItems = [
    { id: 'levels', label: '3-Level Framework', icon: Activity, badge: 'PS16/17' },
    { id: 'architecture', label: '7-Layer Architecture', icon: Layers, badge: 'System' },
    { id: 'rbac', label: 'Stakeholder Matrix', icon: ShieldCheck },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const handleLoginSuccess = (sessionData) => {
    setUserSession(sessionData);
    setSelectedState(sessionData.state);
  };

  const handleOpenProjectDetail = (projId) => {
    setSelectedProjectId(projId || 'NH-GJ-2026-001');
    setActiveTab('project-detail');
  };

  return (
    <div className="min-h-screen bg-[#0b1a30] text-slate-100 flex flex-col font-sans antialiased select-none">
      {/* 1. TOP HEADER NAVBAR */}
      <header className="bg-white text-slate-900 border-b border-slate-200 px-4 py-2 flex flex-wrap justify-between items-center shadow-sm z-30">
        {/* Left Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('admin')}>
          <div className="w-9 h-11 bg-amber-50 rounded border border-amber-300 flex flex-col items-center justify-center p-0.5 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-[#0b2545]" />
            <span className="text-[6px] font-bold text-amber-800 uppercase tracking-tighter">Satyameva Jayate</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-[#0b2545] tracking-tight font-serif">N-LAMS</h1>
            </div>
            <p className="text-[11px] font-extrabold text-slate-800 leading-none">
              National Land Acquisition & Management System
            </p>
            <p className="text-[9px] font-semibold text-slate-500 mt-0.5">
              Digital Land | Transparent Governance | Developed India
            </p>
          </div>
        </div>

        {/* Center Top Nav Pill Tabs */}
        <div className="hidden xl:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'admin' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin Portals</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'demo' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>10-Step Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('gis')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'gis' ? 'bg-[#0284c7] text-white font-bold shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'projects' || activeTab === 'project-detail' ? 'bg-[#0284c7] text-white font-bold shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'alerts' ? 'bg-red-600 text-white font-bold shadow' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>AI Alerts (5)</span>
          </button>
        </div>

        {/* Right User Controls & RBAC Login Trigger */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 border border-slate-300 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg font-bold">
            <span>{userSession.state}</span>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center space-x-2 bg-[#0b2545] hover:bg-blue-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <div className="text-left leading-tight hidden sm:block">
              <div className="text-[11px] font-extrabold">{userSession.roleTitle}</div>
              <div className="text-[9px] text-blue-200">{userSession.orgType}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* 2. SUB-HEADER BREADCRUMB & PROJECT STATUS BAR */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex flex-wrap justify-between items-center text-xs text-slate-700 font-medium">
        <div className="flex items-center space-x-2 text-slate-500">
          <span
            className="hover:text-blue-700 cursor-pointer"
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </span>
          <span className="text-slate-400">/</span>
          <span
            className="font-bold text-slate-800 cursor-pointer hover:text-blue-700"
            onClick={() => handleOpenProjectDetail('NH-GJ-2026-001')}
          >
            {selectedProjectId}
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
            {activeTab} View
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-800 hidden sm:inline">
            Active Project: <span className="font-black text-slate-900">Ahmedabad–Rajkot Green Highway</span>
          </span>
          <button
            onClick={() => handleOpenProjectDetail('NH-GJ-2026-001')}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-sm transition-colors"
          >
            <span>62.4% Acquired (780/1,250 Ha)</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER (LEFT SIDEBAR + CONTENT AREA) */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* LEFT SIDEBAR MENU */}
        <aside className="w-60 bg-[#0b1a30] text-slate-300 border-r border-slate-800 flex flex-col justify-between p-3 shrink-0 overflow-y-auto">
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase px-3 mb-2">
              Operations
            </div>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0284c7] text-white shadow-md font-extrabold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                        item.badge === 'KILLER DEMO' ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase px-3 mt-4 mb-2">
              System Architecture
            </div>
            <nav className="space-y-1">
              {systemMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0284c7] text-white shadow-md font-extrabold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-slate-800 text-blue-300 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase px-3 mb-2">
              Role Switcher
            </div>
            <nav className="space-y-1 text-xs font-semibold">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-amber-300 hover:bg-slate-800 transition-colors font-bold"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Switch Portal Role</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-grow bg-slate-900 relative overflow-y-auto">
          {activeTab === 'admin' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <AdminPortalSwitcher
                onSelectProject={(projId) => handleOpenProjectDetail(projId || 'NH-GJ-2026-001')}
                onCreateProject={() => setActiveTab('demo')}
              />
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <ClosedLoopGovernanceDemo
                onNavigateToTab={(tab) => {
                  if (tab === 'project') {
                    handleOpenProjectDetail('NH-GJ-2026-001');
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <NationalOverview onSelectProject={(proj) => handleOpenProjectDetail(proj?.id || 'NH-GJ-2026-001')} />
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <ProjectsPage onSelectProject={(proj) => handleOpenProjectDetail(proj?.id || proj)} />
            </div>
          )}

          {activeTab === 'project-detail' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <ProjectDetailPage
                projectId={selectedProjectId}
                onBack={() => setActiveTab('projects')}
                onOpenGis={() => setActiveTab('gis')}
              />
            </div>
          )}

          {activeTab === 'gis' && (
            <GISFullMapView
              onSelectParcelDetails={(parcel) => setSelectedParcelForTree(parcel)}
            />
          )}

          {activeTab === 'lifecycle' && (
            <div className="p-6 bg-[#f4f7f6] min-h-full">
              <StatutoryLifecycle />
            </div>
          )}

          {activeTab === 'compensation' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <CompensationPage onSelectProject={(projId) => handleOpenProjectDetail(projId)} />
            </div>
          )}

          {activeTab === 'rr' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <RRPage onSelectProject={(projId) => handleOpenProjectDetail(projId)} />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <AlertsPage onSelectProject={(projId) => handleOpenProjectDetail(projId)} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <AnalyticsPage onSelectProject={(projId) => handleOpenProjectDetail(projId)} />
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6 bg-[#0b1a30] min-h-full text-slate-100">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-xl font-bold font-serif mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  National Document Repository & Integrity Vault
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">NH_GJ_2026_DPR.pdf</div>
                      <div className="text-slate-400 text-xs">Uploaded by Gujarat State Officer • Version v1</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                    </div>
                    <span className="bg-emerald-950 text-emerald-300 font-bold px-3 py-1 rounded">VERIFIED</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">Land_Requirement_Report.pdf</div>
                      <div className="text-slate-400 text-xs">Uploaded by District Collectorate • Version v1</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">SHA-256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4</div>
                    </div>
                    <span className="bg-emerald-950 text-emerald-300 font-bold px-3 py-1 rounded">VERIFIED</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">Gazette_3A_3D_Draft.pdf</div>
                      <div className="text-slate-400 text-xs">Uploaded by Acquisition Officer • Version v2</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">SHA-256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8</div>
                    </div>
                    <span className="bg-amber-950 text-amber-300 font-bold px-3 py-1 rounded">PENDING APPROVAL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <AuditLogsPage />
            </div>
          )}

          {activeTab === 'levels' && (
            <div className="p-6 bg-[#f4f7f6] min-h-full">
              <ProblemLevelSwitcher />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="p-6 bg-[#f4f7f6] min-h-full">
              <SystemArchitecture />
            </div>
          )}

          {activeTab === 'rbac' && (
            <div className="p-6 bg-[#f4f7f6] min-h-full">
              <StakeholderMatrix />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-[#0b1a30] min-h-full">
              <SettingsPage />
            </div>
          )}
        </main>
      </div>

      {/* Family Tree Modal */}
      {selectedParcelForTree && (
        <FamilyTreeModal
          isOpen={!!selectedParcelForTree}
          onClose={() => setSelectedParcelForTree(null)}
          parcelData={selectedParcelForTree}
        />
      )}

      {/* RBAC Login Modal */}
      <RbacLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
