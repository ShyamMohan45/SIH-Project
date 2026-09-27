import React, { useState } from 'react';
import {
  ShieldCheck, Users, Building2, Key, CheckCircle2, Lock, Eye, Edit3,
  FileCheck, Globe, MapPin, Smartphone, UserCheck
} from 'lucide-react';

export default function StakeholderMatrixPage() {
  const [selectedRole, setSelectedRole] = useState('ALL');

  const stakeholders = [
    {
      id: 'CENTRAL_ADMIN',
      title: 'Central MoRTH / MoRD National Directorate',
      tier: 'Central Government (Tier 1)',
      category: 'POLICY_MONITORING',
      jurisdiction: 'Pan-India National Highway & Infrastructure Corridors',
      statutoryDuties: 'Policy direction, national PM GatiShakti sync, inter-state corridor approval, budget allocation, parliamentary reporting',
      portalAccess: 'Full National Read/Write, Predictive Risk Dashboard, National Escalations, API Gateway Control',
      authMethod: 'NIC e-Sign / Gov-SSO (JanParichay) + 2FA',
      activeUsers: 48
    },
    {
      id: 'STATE_NODAL',
      title: 'State Principal Secretary (Revenue) / Nodal Officer',
      tier: 'State Government (Tier 2)',
      category: 'STATUTORY_AUTHORITY',
      jurisdiction: 'State-wide Revenue Jurisdictions (e.g. Gujarat, Maharashtra)',
      statutoryDuties: 'Section 4 SIA approval, Section 8 acquisition sanction, State Gazette notification under Section 19, inter-departmental dispute resolution',
      portalAccess: 'State Command View, Section 19 Approvals, Fast-Track Lok Adalat Direction, DILRMP Sync',
      authMethod: 'State SWAN VPN + Digital Signature Certificate (DSC Class 3)',
      activeUsers: 124
    },
    {
      id: 'CALA_COLLECTOR',
      title: 'District Collector & Competent Authority (CALA)',
      tier: 'District Administration (Tier 3)',
      category: 'STATUTORY_AUTHORITY',
      jurisdiction: 'Revenue District & Sub-Divisions (e.g. Surendranagar District)',
      statutoryDuties: 'Section 11 Gazette issue, Section 15 objection hearings, Section 23 Award determination, 100% Solatium computation, PFMS DBT disbursal authorization',
      portalAccess: 'Award Engine, Objections Registry, Solatium Calculator, DBT Authorization, Field App Dossier Review',
      authMethod: 'NIC District Portal DSC + Aadhaar OTP',
      activeUsers: 742
    },
    {
      id: 'PROJECT_PROPONENT',
      title: 'Project Executing Agency (NHAI / DFCCIL / RVNL)',
      tier: 'Executing Agency (Tier 3)',
      category: 'PROPONENT',
      jurisdiction: 'Assigned Project Alignment & Right-of-Way (RoW)',
      statutoryDuties: 'Requisition of land, deposit of estimated compensation into escrow, joint alignment verification, contractor site handover',
      portalAccess: 'Alignment RoW Layer, Critical Path Tracking, Delay Simulation, Fund Escrow Ledger',
      authMethod: 'NHAI Enterprise Portal SSO',
      activeUsers: 310
    },
    {
      id: 'FIELD_OFFICER',
      title: 'Cadastral Field Surveyor & Verification Officer',
      tier: 'Ground Execution (Mobile App)',
      category: 'GROUND_TRUTH',
      jurisdiction: 'Assigned Talukas, Villages, and Khasra Numbers',
      statutoryDuties: 'Physical boundary demarcation, GPS coordinate collection, geotagged photographic evidence, dispute and obstruction logging',
      portalAccess: 'Field Officer Mobile App (Android APK), Ground Inspection Upload, Offline Queue Sync',
      authMethod: 'm-Seva Mobile Credential + Device Hardware Token + Geofence GPS Check',
      activeUsers: 2450
    },
    {
      id: 'LANDOWNER',
      title: 'Affected Landowner & Project Affected Family (PAF)',
      tier: 'Public / Citizen Beneficiary',
      category: 'BENEFICIARY',
      jurisdiction: 'Individual Khasra / Survey Number & Homestead',
      statutoryDuties: 'Submission of title documents under Section 21, bank account linking for PFMS DBT, claim participation in public hearings',
      portalAccess: 'Citizen Single-Window Tracking Portal, DBT Payment Tracker, Grievance Lodgement, Family Tree Verification',
      authMethod: 'Aadhaar e-KYC / Mobile OTP',
      activeUsers: 85200
    }
  ];

  const filtered = selectedRole === 'ALL'
    ? stakeholders
    : stakeholders.filter(s => s.category === selectedRole);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                Governance & Security Framework
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Multi-Agency Role-Based Access Control (RBAC)
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              Statutory Stakeholder Matrix & RBAC
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Clear separation of statutory duties across Central Ministries, State Revenue Authorities, CALA/Collectors, Field Surveyors, and Affected Landowners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Stakeholder Categories</option>
              <option value="POLICY_MONITORING">Central Monitoring & Policy</option>
              <option value="STATUTORY_AUTHORITY">State & District Statutory Authorities</option>
              <option value="PROPONENT">Project Executing Agencies</option>
              <option value="GROUND_TRUTH">Ground Field Survey Units</option>
              <option value="BENEFICIARY">Affected Landowners & Citizens</option>
            </select>
          </div>
        </div>

        {/* 4 Summary Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Recognized Roles</div>
            <div className="text-xl font-black text-[#0b2545] mt-0.5">6 Core Tiers</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Strict Least Privilege Principle</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Field Surveyor Accounts</div>
            <div className="text-xl font-black text-purple-900 mt-0.5">2,450 Mobile Users</div>
            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Geofenced Token Auth</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">CALA Authorities Active</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">742 Officers</div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">Class-3 DSC Signing</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Citizen Beneficiaries</div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">85,200+ PAFs</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Aadhaar e-KYC Verified</div>
          </div>
        </div>
      </div>

      {/* Stakeholders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="inline-block bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  {item.tier}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{item.title}</h3>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{item.jurisdiction}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {item.activeUsers.toLocaleString()} Active
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Statutory Legal Mandate (RFCTLARR 2013):</span>
                <p className="text-slate-600 leading-relaxed">{item.statutoryDuties}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-0.5">System Access & Functional Capabilities:</span>
                <p className="text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                  {item.portalAccess}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">Authentication Mechanism:</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  {item.authMethod}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
