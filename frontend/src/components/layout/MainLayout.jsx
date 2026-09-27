import React, { useState } from 'react';
import TopHeader from './TopHeader';
import Sidebar from './Sidebar';
import GlobalSearchModal from './GlobalSearchModal';
import VideoModal from '../common/VideoModal';

// Redesigned Institutional Pages
import DashboardPage from '../../pages/DashboardPage';
import ProjectsPage from '../../pages/ProjectsPage';
import ProjectDetailPage from '../../pages/ProjectDetailPage';
import GISMapStudio from '../../pages/GISMapStudio';
import StatutoryLifecyclePage from '../../pages/StatutoryLifecyclePage';
import ParcelsPage from '../../pages/ParcelsPage';
import FieldInspectionsPage from '../../pages/FieldInspectionsPage';
import AIRiskPage from '../../pages/AIRiskPage';
import AlertsPage from '../../pages/AlertsPage';
import RecommendationsPage from '../../pages/RecommendationsPage';
import CompensationPage from '../../pages/CompensationPage';
import LegalPage from '../../pages/LegalPage';
import RRPage from '../../pages/RRPage';
import DocumentsPage from '../../pages/DocumentsPage';
import ReportsPage from '../../pages/ReportsPage';
import AuditLogsPage from '../../pages/AuditLogsPage';
import StakeholderMatrixPage from '../../pages/StakeholderMatrixPage';
import SettingsPage from '../../pages/SettingsPage';

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState('NH-GJ-2026-001');
  const [selectedKhasra, setSelectedKhasra] = useState('1042');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('All India');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  const [userSession, setUserSession] = useState({
    id: 'CENTRAL_ADMIN',
    title: 'Central Administrator',
    dept: 'Ministry of Rural Development (DoLR)',
    state: 'All India',
    district: 'All Districts'
  });

  const handleRoleSwitch = (role) => {
    setUserSession(role);
    setSelectedState(role.state);
    setSelectedDistrict(role.district);
  };

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId || 'NH-GJ-2026-001');
    setActiveTab('project-detail');
  };

  const handleSelectParcel = (khasra, projId) => {
    if (khasra) setSelectedKhasra(khasra);
    if (projId) setSelectedProjectId(projId);
    setActiveTab('gis');
  };

  // Breadcrumb mapping
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Control Room Overview';
      case 'projects': return 'Projects Directory';
      case 'project-detail': return `Project Dossier (${selectedProjectId})`;
      case 'gis': return 'Operational GIS Map Studio';
      case 'workflow': return 'RFCTLARR Statutory Lifecycle (10 Stages)';
      case 'parcels': return 'Cadastral Parcels Registry';
      case 'field_inspections': return 'Ground Truthing & Field Inspection Cell';
      case 'ai_risk': return 'PS17 Predictive Delay Risk (SHAP ML)';
      case 'alerts': return 'Early Warning Alerts';
      case 'recommendations': return 'Closed-Loop Action Engine';
      case 'compensation': return 'Compensation & PFMS DBT Ledger';
      case 'legal': return 'Legal Objections & High Court Petitions';
      case 'rr': return 'Resettlement & Rehabilitation (RFCTLARR Sch-II)';
      case 'documents': return 'Document Integrity Vault (SHA-256)';
      case 'reports': return 'Reports & Analytics Export';
      case 'audit': return 'Immutable Audit Trail Logs';
      case 'rbac': return 'Statutory Stakeholder Matrix';
      case 'settings': return 'Platform Settings & Gateways';
      default: return 'Control Room';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <TopHeader
        userSession={userSession}
        onRoleSwitch={handleRoleSwitch}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenVideo={() => setIsVideoOpen(true)}
        activeAlertsCount={6}
      />

      {/* Main Container: Sidebar + Viewport */}
      <div className="flex flex-1 overflow-hidden">
        {/* Authoritative Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          userSession={userSession}
          onLogout={() => {
            alert('Session logged out securely.');
            setActiveTab('dashboard');
          }}
        />

        {/* Scrollable Viewport Area */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 bg-[#f8fafc]">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className="hover:text-blue-700 cursor-pointer text-slate-600"
                onClick={() => setActiveTab('dashboard')}
              >
                N-LAMS
              </span>
              <span>/</span>
              {activeTab === 'project-detail' ? (
                <>
                  <span
                    className="hover:text-blue-700 cursor-pointer text-slate-600"
                    onClick={() => setActiveTab('projects')}
                  >
                    Projects Directory
                  </span>
                  <span>/</span>
                  <span className="font-bold text-slate-900">{selectedProjectId}</span>
                </>
              ) : (
                <span className="font-bold text-slate-900">{getTabLabel(activeTab)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                Jurisdiction: <span className="font-bold text-blue-900">{selectedState}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                NIC Cloud Active
              </span>
            </div>
          </div>

          {/* Active View Router */}
          {activeTab === 'dashboard' && (
            <DashboardPage
              onSelectProject={handleSelectProject}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'project-detail' && (
            <ProjectDetailPage
              projectId={selectedProjectId}
              onBack={() => setActiveTab('projects')}
              onSelectParcel={(khasra) => handleSelectParcel(khasra, selectedProjectId)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'gis' && (
            <GISMapStudio
              onSelectProject={handleSelectProject}
              onSelectParcelDetail={(parcel) => {
                setSelectedKhasra(parcel.khasra_number);
                setActiveTab('field_inspections');
              }}
            />
          )}

          {activeTab === 'workflow' && (
            <StatutoryLifecyclePage
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'parcels' && (
            <ParcelsPage
              onSelectProject={handleSelectProject}
              onOpenGis={(khasra) => handleSelectParcel(khasra, selectedProjectId)}
            />
          )}

          {activeTab === 'field_inspections' && (
            <FieldInspectionsPage
              onSelectParcel={(khasra) => handleSelectParcel(khasra, selectedProjectId)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'ai_risk' && (
            <AIRiskPage
              onSelectProject={handleSelectProject}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsPage
              onSelectProject={handleSelectProject}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              onSelectProject={handleSelectProject}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'compensation' && (
            <CompensationPage
              projectId={selectedProjectId}
            />
          )}

          {activeTab === 'legal' && (
            <LegalPage
              projectId={selectedProjectId}
            />
          )}

          {activeTab === 'rr' && (
            <RRPage
              projectId={selectedProjectId}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsPage
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage />
          )}

          {activeTab === 'audit' && (
            <AuditLogsPage />
          )}

          {activeTab === 'rbac' && (
            <StakeholderMatrixPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToProject={(projId) => {
          handleSelectProject(projId);
          setIsSearchOpen(false);
        }}
        onNavigateToParcel={(khasra, projId) => {
          handleSelectParcel(khasra, projId);
          setIsSearchOpen(false);
        }}
        onNavigateToInspection={(inspId) => {
          setActiveTab('field_inspections');
          setIsSearchOpen(false);
        }}
      />

      {/* Official System Demonstration Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoId="ELO-9TsPu3k"
      />
    </div>
  );
}
