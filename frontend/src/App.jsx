import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Portal Layout and Pages
import PublicLayout from './components/layout/PublicLayout';
import PublicDashboardPage from './pages/public/PublicDashboardPage';
import PublicProjectsPage from './pages/public/PublicProjectsPage';
import PublicProjectDetailPage from './pages/public/PublicProjectDetailPage';
import PublicNoticesPage from './pages/public/PublicNoticesPage';
import PublicReportsPage from './pages/public/PublicReportsPage';
import PublicGISMapPage from './pages/public/PublicGISMapPage';
import PublicHelpPage from './pages/public/PublicHelpPage';

// Administrative Login
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Central Administration Portal
import CentralAdminLayout from './components/layout/CentralAdminLayout';
import CentralDashboardPage from './pages/admin/central/CentralDashboardPage';
import CentralStatesPage from './pages/admin/central/CentralStatesPage';
import CentralProfilePage from './pages/admin/central/CentralProfilePage';
import CentralAuditPage from './pages/admin/central/CentralAuditPage';

// State Administration Portal
import StateAdminLayout from './components/layout/StateAdminLayout';
import StateDashboardPage from './pages/admin/state/StateDashboardPage';
import StateDistrictsPage from './pages/admin/state/StateDistrictsPage';
import StateProjectsPage from './pages/admin/state/StateProjectsPage';
import StateProfilePage from './pages/admin/state/StateProfilePage';

// Existing Comprehensive Operations Control Room & Staff Portal
import MainLayout from './components/layout/MainLayout';
import ProjectsPage from './pages/ProjectsPage';
import OperationalGISPage from './pages/OperationalGISPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================================
            1. PUBLIC / COMMON CITIZEN PORTAL (NO LOGIN REQUIRED)
            ============================================================ */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<PublicDashboardPage />} />
          <Route path="public" element={<Navigate to="/" replace />} />
          <Route path="public/projects" element={<PublicProjectsPage />} />
          <Route path="public/projects/:id" element={<PublicProjectDetailPage />} />
          <Route path="public/notices" element={<PublicNoticesPage />} />
          <Route path="public/reports" element={<PublicReportsPage />} />
          <Route path="public/map" element={<PublicGISMapPage />} />
          <Route path="public/help" element={<PublicHelpPage />} />
        </Route>

        {/* ============================================================
            2. DEDICATED ADMINISTRATIVE LOGIN GATEWAY
            ============================================================ */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ============================================================
            3. CENTRAL ADMINISTRATION CONTROL ROOM (NATIONAL SCOPE)
            ============================================================ */}
        <Route path="/admin/central" element={<CentralAdminLayout />}>
          <Route index element={<Navigate to="/admin/central/dashboard" replace />} />
          <Route path="dashboard" element={<CentralDashboardPage />} />
          <Route path="states" element={<CentralStatesPage />} />
          <Route path="projects" element={<ProjectsPage onSelectProject={() => {}} />} />
          <Route path="profile" element={<CentralProfilePage />} />
          <Route path="audit" element={<CentralAuditPage />} />
        </Route>

        {/* ============================================================
            4. STATE ADMINISTRATION OPERATIONS ROOM (ISOLATED STATE SCOPE)
            ============================================================ */}
        <Route path="/admin/state" element={<StateAdminLayout />}>
          <Route index element={<Navigate to="/admin/state/dashboard" replace />} />
          <Route path="dashboard" element={<StateDashboardPage />} />
          <Route path="districts" element={<StateDistrictsPage />} />
          <Route path="projects" element={<StateProjectsPage />} />
          <Route path="profile" element={<StateProfilePage />} />
        </Route>

        {/* ============================================================
            5. OPERATIONAL GIS STUDIO (DIRECT ROUTE)
            ============================================================ */}
        <Route path="/operational-gis" element={<OperationalGISPage />} />

        {/* ============================================================
            6. EXISTING N-LAMS STAFF / FIELD OFFICER / GIS STUDIO PORTAL
               (Preserving 100% of the existing internal system intact)
            ============================================================ */}
        <Route path="/portal/*" element={<MainLayout />} />
        <Route path="/app/*" element={<MainLayout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
