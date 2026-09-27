import React, { useState } from 'react';
import {
  FileText, ShieldCheck, Download, Search, Filter, Upload, CheckCircle2,
  AlertCircle, Eye, Copy, ExternalLink, Hash, Lock, Clock, FileCheck, X
} from 'lucide-react';

export default function DocumentsPage({ onSelectProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Initial document repository
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-GJ-001-S11',
      title: 'Section 11(1) Preliminary Notification & Boundary Schedule',
      refNumber: 'REV-LA/GJ-SRN-2025/11-042',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'SECTION_11',
      date: '2025-06-15',
      size: '4.8 MB',
      sha256: '9f83a81b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      signatory: 'District Collector & CALA, Surendranagar',
      status: 'VERIFIED',
      gazetteNotified: true
    },
    {
      id: 'DOC-GJ-001-S4',
      title: 'Social Impact Assessment (SIA) Final Report & Recommendations',
      refNumber: 'SIA-UNIT/GUJ/2025/REP-88',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'SIA_REPORT',
      date: '2025-03-20',
      size: '12.4 MB',
      sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      signatory: 'Director, State SIA Cell, Gandhinagar',
      status: 'VERIFIED',
      gazetteNotified: false
    },
    {
      id: 'DOC-GJ-001-S19',
      title: 'Section 19(1) Declaration of Resettlement Area & Acquisition Area',
      refNumber: 'REV-LA/GJ-SRN-2025/19-108',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'SECTION_19',
      date: '2025-11-10',
      size: '3.6 MB',
      sha256: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
      signatory: 'Principal Secretary (Revenue), Govt of Gujarat',
      status: 'VERIFIED',
      gazetteNotified: true
    },
    {
      id: 'DOC-GJ-001-S23',
      title: 'Section 23 Provisional Land Award Determination (100% Solatium)',
      refNumber: 'CALA/LMB/AWARD/2026/04',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'AWARD_S23',
      date: '2026-02-14',
      size: '8.2 MB',
      sha256: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      signatory: 'Competent Authority for Land Acquisition (CALA)',
      status: 'VERIFIED',
      gazetteNotified: false
    },
    {
      id: 'DOC-GJ-001-FLD1042',
      title: 'Ground Inspection Dossier & Geotagged Photo Evidence — Khasra 1042',
      refNumber: 'FIELD-INSP/2026/GJ-1042',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'FIELD_EVIDENCE',
      date: '2026-03-10',
      size: '18.9 MB',
      sha256: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      signatory: 'Field Officer Inspector (ID: FO-8832)',
      status: 'VERIFIED',
      gazetteNotified: false
    },
    {
      id: 'DOC-MH-014-HC',
      title: 'High Court Interim Order & Status Quo Notice (SCA 4892/2025)',
      refNumber: 'HC-BOM/CIVIL-WRIT/4892-25',
      project: 'Mumbai–Pune Freight Logistics Corridor (MH-RAIL-2026-014)',
      projectId: 'MH-RAIL-2026-014',
      category: 'LEGAL_ORDER',
      date: '2026-01-22',
      size: '2.1 MB',
      sha256: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      signatory: 'Registrar General, High Court of Bombay',
      status: 'VERIFIED',
      gazetteNotified: false
    },
    {
      id: 'DOC-DL-003-PFMS',
      title: 'PFMS DBT Batch Disbursal Sanction Order — ₹42.80 Cr',
      refNumber: 'PFMS/MOF/DBT-SANCT/2026/891',
      project: 'Delhi–Dehradun Economic Expressway Package-3 (DL-EXP-2026-003)',
      projectId: 'DL-EXP-2026-003',
      category: 'PFMS_DBT',
      date: '2026-02-28',
      size: '1.5 MB',
      sha256: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
      signatory: 'Controller General of Accounts / PFMS Gateway',
      status: 'VERIFIED',
      gazetteNotified: false
    }
  ]);

  // Upload Form State
  const [newDoc, setNewDoc] = useState({
    title: '',
    refNumber: '',
    project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
    projectId: 'NH-GJ-2026-001',
    category: 'SECTION_11',
    signatory: ''
  });

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'SECTION_11', label: 'Section 11 Preliminary' },
    { id: 'SECTION_19', label: 'Section 19 Declaration' },
    { id: 'AWARD_S23', label: 'Section 23 Award' },
    { id: 'SIA_REPORT', label: 'SIA Reports (Sec 4)' },
    { id: 'FIELD_EVIDENCE', label: 'Field Evidence & Photos' },
    { id: 'LEGAL_ORDER', label: 'Court Orders & Writs' },
    { id: 'PFMS_DBT', label: 'PFMS DBT Sanctions' }
  ];

  const filtered = documents.filter(d => {
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.signatory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchProject = selectedProject === 'ALL' || d.projectId === selectedProject;
    return matchSearch && matchCategory && matchProject;
  });

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.refNumber) return;

    const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const created = {
      id: `DOC-NEW-${Date.now().toString().slice(-4)}`,
      title: newDoc.title,
      refNumber: newDoc.refNumber,
      project: newDoc.project,
      projectId: newDoc.projectId,
      category: newDoc.category,
      date: new Date().toISOString().split('T')[0],
      size: '2.4 MB',
      sha256: fakeHash,
      signatory: newDoc.signatory || 'Competent Authority (CALA)',
      status: 'VERIFIED',
      gazetteNotified: false
    };

    setDocuments([created, ...documents]);
    setIsUploadOpen(false);
    setNewDoc({
      title: '',
      refNumber: '',
      project: 'Ahmedabad–Rajkot Green Highway Expansion (NH-GJ-2026-001)',
      projectId: 'NH-GJ-2026-001',
      category: 'SECTION_11',
      signatory: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                RFCTLARR 2013 Statutory Record Vault
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                SHA-256 Cryptographically Sealed
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#0b2545] font-serif">
              National Document Integrity Vault
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Central statutory repository for Gazettes, SIA Reports, Awards, High Court Orders, and Field Survey Geotagged Dossiers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 bg-[#0b2545] hover:bg-[#1e3a8a] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Statutory Document</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Sealed Records</div>
            <div className="text-xl font-black text-[#0b2545] mt-0.5">{documents.length} Files</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">100% Hash Matched</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Gazette Notifications</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">2 Published</div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5">E-Gazette Synchronized</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Field Ground Dossiers</div>
            <div className="text-xl font-black text-purple-900 mt-0.5">1 Geotagged</div>
            <div className="text-[10px] text-purple-700 font-semibold mt-0.5">EXIF & GPS Certified</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Cloud Storage Status</div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">53.4 MB</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">NIC MeghRaj Cloud / Active</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Title, Ref Number, Project, or Signatory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Projects</option>
            <option value="NH-GJ-2026-001">Ahmedabad–Rajkot (NH-GJ-2026-001)</option>
            <option value="MH-RAIL-2026-014">Mumbai–Pune (MH-RAIL-2026-014)</option>
            <option value="DL-EXP-2026-003">Delhi–Dehradun (DL-EXP-2026-003)</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document Details</th>
                <th className="py-3 px-4">Project & Category</th>
                <th className="py-3 px-4">Date & Size</th>
                <th className="py-3 px-4">SHA-256 Checksum</th>
                <th className="py-3 px-4">Signatory Authority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{doc.title}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Ref: <span className="text-blue-700 font-semibold">{doc.refNumber}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-[11px] font-semibold text-slate-800 line-clamp-1">{doc.project}</div>
                    <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded mt-0.5">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{doc.date}</div>
                    <div className="text-[10px] text-slate-400">{doc.size}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {doc.sha256.substring(0, 10)}...{doc.sha256.substring(58)}
                      </code>
                      <button
                        onClick={() => handleCopyHash(doc.sha256, doc.id)}
                        className="text-slate-400 hover:text-blue-600 p-1 rounded"
                        title="Copy SHA-256 Hash"
                      >
                        {copiedHash === doc.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-semibold line-clamp-1">{doc.signatory}</div>
                    {doc.gazetteNotified && (
                      <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Gazette Notified
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {doc.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded"
                        title="Preview Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading verified document ${doc.refNumber} with integrity certificate.`)}
                        className="p-1.5 text-slate-500 hover:text-[#0b2545] hover:bg-slate-100 rounded"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {previewDoc.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{previewDoc.title}</h3>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference Number:</span>
                <span className="font-mono font-bold text-slate-800">{previewDoc.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Project:</span>
                <span className="font-semibold text-slate-800">{previewDoc.project}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Signatory:</span>
                <span className="font-semibold text-slate-800">{previewDoc.signatory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Upload Date & Size:</span>
                <span className="text-slate-700">{previewDoc.date} ({previewDoc.size})</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cryptographic SHA-256 Digest</div>
                <code className="block font-mono text-[10px] text-slate-800 bg-white p-2 rounded border border-slate-200 break-all select-all">
                  {previewDoc.sha256}
                </code>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Valid NIC GovCA Digital Signature
              </div>
              <button
                onClick={() => {
                  alert(`Downloading ${previewDoc.refNumber}...`);
                  setPreviewDoc(null);
                }}
                className="bg-[#0b2545] hover:bg-[#1e3a8a] text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Verified PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Upload Statutory Document</h3>
            <p className="text-xs text-slate-500 mb-4">
              All statutory records are hashed via SHA-256 and sealed with institutional audit timestamps.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section 15 Hearing Minutes & Summary"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Reference Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CALA/LMB/HEAR/2026/09"
                  value={newDoc.refNumber}
                  onChange={(e) => setNewDoc({ ...newDoc, refNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statutory Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="SECTION_11">Section 11 Preliminary</option>
                    <option value="SECTION_19">Section 19 Declaration</option>
                    <option value="AWARD_S23">Section 23 Award</option>
                    <option value="SIA_REPORT">SIA Report (Sec 4)</option>
                    <option value="FIELD_EVIDENCE">Field Evidence</option>
                    <option value="LEGAL_ORDER">Court Order</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Signatory Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. District Collector"
                    value={newDoc.signatory}
                    onChange={(e) => setNewDoc({ ...newDoc, signatory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-bold text-slate-700 mb-1">Select File (PDF, GeoJSON, TIFF, ZIP)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium">Click to choose file or drag and drop</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Maximum size: 50MB</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-600 font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0b2545] hover:bg-[#1e3a8a] text-white font-bold"
                >
                  Seal & Commit Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
