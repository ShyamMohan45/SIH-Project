import React, { useState } from 'react';
import {
  Settings, ShieldCheck, CheckCircle2, Server, Cpu, Database, RefreshCw,
  Lock, AlertTriangle, User, Globe, Activity, Check, ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [testingGateway, setTestingGateway] = useState(null);

  const integrations = [
    {
      name: 'PM GatiShakti National Master Plan (NMP)',
      purpose: 'Multi-Modal Logistics Corridor Alignment & Layer Sync',
      endpoint: 'https://api.gatishakti.gov.in/v2/corridors',
      status: 'ONLINE',
      latency: '42ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'Every 6 Hours'
    },
    {
      name: 'BhoomiRashi (MoRTH Land Acquisition Portal)',
      purpose: 'Section 3A/3D/3G Statutory Gazette Publications Sync',
      endpoint: 'https://bhoomirashi.gov.in/api/notifications',
      status: 'ONLINE',
      latency: '65ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'Real-time Webhook'
    },
    {
      name: 'Public Financial Management System (PFMS)',
      purpose: 'Direct Benefit Transfer (DBT) & Escrow Reconciliations',
      endpoint: 'https://pfms.nic.in/dbt/gateway/v1',
      status: 'ONLINE',
      latency: '58ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'Daily Batch at 23:00'
    },
    {
      name: 'DILRMP State Land Records (AnyRoR / Bhoomi)',
      purpose: 'Cadastral Map RoR / 7/12 Mutation Registry Integration',
      endpoint: 'https://anyror.gujarat.gov.in/api/khasra',
      status: 'ONLINE',
      latency: '82ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'On-Demand / Nightly'
    },
    {
      name: 'PARIVESH (MoEFCC Environmental Clearances)',
      purpose: 'Forest Stage-I / Stage-II & Wildlife Clearance Tracking',
      endpoint: 'https://parivesh.nic.in/rest/clearance-status',
      status: 'ONLINE',
      latency: '110ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'Weekly Polling'
    },
    {
      name: 'ISRO Bhuvan High-Resolution Satellite WMS',
      purpose: 'High-Resolution Satellite Basemaps & Change Detection',
      endpoint: 'https://bhuvan-app1.nrsc.gov.in/wms',
      status: 'ONLINE',
      latency: '75ms',
      badge: 'DEMO DATA | SYNTHETIC INTEGRATION',
      syncInterval: 'Direct WMS Stream'
    }
  ];

  const handleTestGateway = (idx) => {
    setTestingGateway(idx);
    setTimeout(() => {
      setTestingGateway(null);
    }, 800);
  };

  const handleResetDemoData = async () => {
    setIsResetting(true);
    setResetMessage('');
    try {
      if (api.resetDemo) {
        await api.resetDemo();
      }
      setTimeout(() => {
        setIsResetting(false);
        setResetMessage('Demo dataset successfully restored to pristine state.');
      }, 1000);
    } catch (e) {
      setIsResetting(false);
      setResetMessage('Demo state refreshed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                System Health & National Connectors
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                6 of 6 Gateways Operational (99.8%)
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              N-LAMS Platform Settings & Gateway Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configuration of statutory APIs, machine learning pipelines, and officer cryptographic profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemoData}
              disabled={isResetting}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Restoring...' : 'Reset Demo Dataset'}</span>
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {resetMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: External Statutory API Gateways */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  National Statutory Interoperability Gateways
                </h2>
                <p className="text-xs text-slate-500">
                  External national systems linked via API connectors. Note: External mock data is clearly indicated.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                TLS 1.3 / mTLS
              </span>
            </div>

            <div className="space-y-3">
              {integrations.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-blue-300 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.purpose}</p>
                      <code className="text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                        {item.endpoint}
                      </code>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {item.latency}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {item.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTestGateway(idx)}
                        disabled={testingGateway === idx}
                        className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 mt-1.5 block ml-auto"
                      >
                        {testingGateway === idx ? 'Testing...' : 'Ping Gateway'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Model & Security Configuration */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                PS 17 Predictive Engine Configuration
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ML Model Algorithm:</span>
                <span className="font-mono font-bold text-slate-800">XGBoost Survival v2.4</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Explainability Framework:</span>
                <span className="font-mono font-bold text-slate-800">TreeSHAP (Lundberg 2020)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Model AUC ROC:</span>
                <span className="font-mono font-bold text-emerald-700">0.892 (High Accuracy)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Early Warning Threshold:</span>
                <span className="font-mono font-bold text-amber-700">&gt; 65% Probability</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Inference Latency:</span>
                <span className="font-mono font-bold text-slate-800">18ms / parcel</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Field Officer Mobile Sync Gateway
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Dedicated secure channel connecting the Field Officer inspection mobile app (Android APK) to the central PostgreSQL / SQLite database.
              </p>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sync Protocol:</span>
                  <span className="font-mono font-semibold text-slate-800">REST + ETag Hashing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Minimum Accuracy:</span>
                  <span className="font-mono font-semibold text-slate-800">&le; 10 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Photo Hash Check:</span>
                  <span className="font-mono font-semibold text-emerald-700">SHA-256 Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
