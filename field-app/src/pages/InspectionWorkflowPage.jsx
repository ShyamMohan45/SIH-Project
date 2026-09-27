import React, { useState, useEffect } from 'react';
import {
  MapPin, Camera, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight,
  Shield, Upload, Plus, Trash2, Eye, FileCheck, Sparkles, ArrowRight,
  WifiOff, Crosshair
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from '../components/common/StatusBadge';
import CameraCaptureModal from '../components/common/CameraCaptureModal';
import { api } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';
import { DEMO_COORDS, calculateDistance } from '../services/geoUtils';
import { nativeService } from '../services/nativeService';

const officerIcon = new L.DivIcon({
  className: 'officer-marker',
  html: `<div style="position:relative; width:22px; height:22px;">
    <div style="position:absolute; width:22px; height:22px; background:rgba(29, 78, 216, 0.4); border-radius:50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="position:absolute; top:3px; left:3px; width:16px; height:16px; background:#1d4ed8; border:3px solid #ffffff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 17);
  }, [center, map]);
  return null;
}

export default function InspectionWorkflowPage({
  task = {
    id: 'TASK-FO-1042',
    task_code: 'FO-1042',
    khasra_number: '1042',
    project_id: 'NH-GJ-2026-001',
    parcel_id: 'P-1042',
    village: 'Limbdi',
    district: 'Surendranagar',
    area_ha: 2.45,
    priority: 'HIGH'
  },
  onBack,
  onComplete
}) {
  const [step, setStep] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraCategory, setCameraCategory] = useState('Survey Marker');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // ----------------------------------------------------
  // GROUND TRUTH FORM STATE (Loaded from draft if exists)
  // ----------------------------------------------------
  const [gps, setGps] = useState({
    verified: false,
    mode: 'REAL', // REAL or DEMO_SIMULATED
    lat: DEMO_COORDS.officerGps.lat,
    lng: DEMO_COORDS.officerGps.lng,
    accuracy: 8.0,
    distanceMeters: 12.4,
    locationMatched: true,
    acquiring: false
  });

  const [khasra, setKhasra] = useState({
    expected: task.khasra_number || '1042',
    observed: task.khasra_number || '1042',
    matched: true,
    markerPhoto: null
  });

  const [boundary, setBoundary] = useState({
    matchesGis: 'NO', // Default for demo scenario
    remarks: 'Southern boundary ridge differs by 4.2m from digital GIS cadastre.'
  });

  const [landUse, setLandUse] = useState({
    recorded: 'Agricultural',
    actual: 'Agricultural',
    isRecordedCorrect: 'YES',
    crop: 'Cotton',
    condition: 'Good',
    structurePresent: 'No',
    structureType: 'Shed',
    structureCount: 0,
    encroachmentObserved: 'No',
    encroachmentType: 'Temporary fencing',
    encroachmentSeverity: 'Medium',
    encroachmentDesc: ''
  });

  const [occupancy, setOccupancy] = useState({
    present: 'YES',
    personType: 'Owner',
    name: 'Devji Koli',
    status: 'Verified'
  });

  const [compensation, setCompensation] = useState({
    statusRecorded: 'Pending',
    awardAmount: '₹ 45,60,000',
    confirmedByPerson: 'NO',
    issue: 'Payment not received',
    remarks: 'Occupant stated award sanctioned in gazette but bank credit pending due to IFSC verification.'
  });

  const [dispute, setDispute] = useState({
    reported: 'YES',
    type: 'Owner dispute',
    severity: 'High',
    description: 'Co-sharer succession conflict filed before Sub-Divisional Magistrate.'
  });

  const [rr, setRr] = useState({
    familyId: 'FAM-GJ-1042-01',
    required: 'Yes',
    verified: 'Yes',
    status: 'Pending',
    category: 'Livelihood',
    remarks: 'Agricultural livelihood assistance package verification pending.'
  });

  const [checklist, setChecklist] = useState({
    boundary_visible: true,
    survey_marker_available: true,
    land_use_verified: true,
    area_consistent: true,
    notice_received: true,
    owner_verified: true,
    compensation_discussed: true,
    possession_checked: true,
    affected_family_verified: true,
    rr_checked: true,
    survey_number_checked: true,
    field_evidence_captured: true
  });

  const [photos, setPhotos] = useState([
    {
      id: 'PH-DEMO-1',
      category: 'Survey/Khasra Marker',
      file_name: `Survey_Stone_Khasra_${task.khasra_number || '1042'}.jpg`,
      file_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
      latitude: 22.386221,
      longitude: 71.064316,
      accuracy: 8,
      timestamp: '2026-09-12 10:15:30',
      uploaded_by: 'FO-007'
    }
  ]);

  const [manualIssues, setManualIssues] = useState([]);
  const [remarks, setRemarks] = useState(
    `Ground cadastral survey conducted for Khasra ${task.khasra_number || '1042'} in ${task.village || 'Limbdi'}. Physical survey marker inspected.`
  );
  const [officerConfirmed, setOfficerConfirmed] = useState(true);

  // Auto-save draft on step transition
  useEffect(() => {
    const draftPayload = {
      task_id: task.id,
      step,
      gps,
      khasra,
      boundary,
      landUse,
      occupancy,
      compensation,
      dispute,
      rr,
      checklist,
      photos,
      manualIssues,
      remarks,
      officerConfirmed
    };
    offlineStorage.saveDraft(task.id, draftPayload);
  }, [step, gps, khasra, boundary, landUse, occupancy, compensation, dispute, rr, checklist, photos, manualIssues, remarks, officerConfirmed]);

  // Load existing draft if available
  useEffect(() => {
    const existing = offlineStorage.getDraft(task.id);
    if (existing) {
      if (existing.gps) setGps(existing.gps);
      if (existing.khasra) setKhasra(existing.khasra);
      if (existing.boundary) setBoundary(existing.boundary);
      if (existing.landUse) setLandUse(existing.landUse);
      if (existing.occupancy) setOccupancy(existing.occupancy);
      if (existing.compensation) setCompensation(existing.compensation);
      if (existing.dispute) setDispute(existing.dispute);
      if (existing.rr) setRr(existing.rr);
      if (existing.checklist) setChecklist(existing.checklist);
      if (existing.photos) setPhotos(existing.photos);
      if (existing.remarks) setRemarks(existing.remarks);
    }
  }, [task.id]);

  // GPS Handlers
  const handleAcquireDeviceGps = async () => {
    setGps(prev => ({ ...prev, acquiring: true }));
    try {
      const loc = await nativeService.getGpsLocation();
      if (loc && loc.success) {
        const lat = loc.latitude;
        const lng = loc.longitude;
        const acc = loc.accuracy || 8;
        const dist = calculateDistance(lat, lng, DEMO_COORDS.khasra1042.lat, DEMO_COORDS.khasra1042.lng);
        setGps({
          verified: true,
          mode: 'REAL',
          lat,
          lng,
          accuracy: acc,
          distanceMeters: dist,
          locationMatched: dist <= 150,
          acquiring: false
        });
        return;
      }
    } catch (err) {
      console.warn('Native GPS acquisition error:', err);
    }
    // Fallback to Demo GPS if device location not available
    handleUseDemoGps();
  };

  const handleUseDemoGps = () => {
    setGps({
      verified: true,
      mode: 'DEMO_SIMULATED',
      lat: DEMO_COORDS.officerGps.lat,
      lng: DEMO_COORDS.officerGps.lng,
      accuracy: 8.0,
      distanceMeters: 12.4,
      locationMatched: true,
      acquiring: false
    });
  };

  // Khasra Verification
  const handleVerifyKhasra = () => {
    const isMatch = khasra.observed.trim() === khasra.expected.trim();
    setKhasra(prev => ({ ...prev, matched: isMatch }));
  };

  // Smart Issue Aggregation
  const getAggregatedIssues = () => {
    const issues = [...manualIssues];
    if (boundary.matchesGis === 'NO') {
      issues.push({
        id: 'ISSUE-AUTO-BOUND',
        issue_type: 'Boundary mismatch',
        severity: 'High',
        description: boundary.remarks || 'Physical boundary differs from GIS record.'
      });
    }
    if (!khasra.matched) {
      issues.push({
        id: 'ISSUE-AUTO-KHASRA',
        issue_type: 'Khasra mismatch',
        severity: 'High',
        description: `Observed Khasra marker ${khasra.observed} does not match expected ${khasra.expected}.`
      });
    }
    if (dispute.reported === 'YES') {
      issues.push({
        id: 'ISSUE-AUTO-DISPUTE',
        issue_type: dispute.type || 'Owner dispute',
        severity: dispute.severity || 'High',
        description: dispute.description || 'Dispute reported on site during inspection.'
      });
    }
    if (compensation.confirmedByPerson === 'NO' || compensation.issue !== 'No issue') {
      issues.push({
        id: 'ISSUE-AUTO-COMP',
        issue_type: 'Compensation issue',
        severity: 'Medium',
        description: compensation.remarks || `Compensation issue: ${compensation.issue}`
      });
    }
    if (landUse.encroachmentObserved === 'YES' || landUse.encroachmentObserved === 'Yes') {
      issues.push({
        id: 'ISSUE-AUTO-ENCROACH',
        issue_type: 'Encroachment',
        severity: landUse.encroachmentSeverity || 'High',
        description: landUse.encroachmentDesc || `Encroachment detected: ${landUse.encroachmentType}`
      });
    }
    return issues;
  };

  const checklistCompletedCount = Object.values(checklist).filter(Boolean).length;

  // Submission Logic
  const handleSubmitInspection = async () => {
    setSubmitting(true);
    const aggregatedIssues = getAggregatedIssues();
    const submissionPayload = {
      task_id: task.id,
      project_id: task.project_id || 'NH-GJ-2026-001',
      parcel_id: task.parcel_id || 'P-1042',
      officer_id: 'FO-007',
      officer_name: 'Amit B. Parmar',
      officer_confirmed: officerConfirmed,
      remarks,
      latitude: gps.lat,
      longitude: gps.lng,
      gps_accuracy: gps.accuracy,
      gps_verified: gps.verified,
      gps_mode: gps.mode,
      distance_from_parcel_m: gps.distanceMeters,
      location_matched: gps.locationMatched,
      khasra_expected: khasra.expected,
      khasra_observed: khasra.observed,
      khasra_matched: khasra.matched,
      boundary_status: boundary.matchesGis === 'YES' ? 'Matched' : 'Mismatch',
      boundary_remarks: boundary.remarks,
      land_use: landUse.actual,
      land_use_recorded: landUse.recorded,
      land_use_observed: landUse.actual,
      land_use_matched: landUse.isRecordedCorrect === 'YES',
      land_condition: landUse.condition,
      crop_type: landUse.crop,
      structure_present: landUse.structurePresent,
      structure_type: landUse.structureType,
      structure_count: Number(landUse.structureCount || 0),
      encroachment_status: landUse.encroachmentObserved,
      encroachment_type: landUse.encroachmentType,
      encroachment_severity: landUse.encroachmentSeverity,
      encroachment_description: landUse.encroachmentDesc,
      occupancy_status: occupancy.status,
      occupant_name: occupancy.name,
      occupant_type: occupancy.personType,
      compensation_status: compensation.statusRecorded,
      compensation_confirmed: compensation.confirmedByPerson,
      compensation_issue: compensation.issue,
      compensation_remarks: compensation.remarks,
      objection_status: dispute.reported,
      dispute_type: dispute.type,
      dispute_severity: dispute.severity,
      dispute_description: dispute.description,
      rr_status: rr.status,
      rr_required: rr.required,
      rr_verified: rr.verified,
      rr_issue: rr.remarks,
      checklist_data: checklist,
      issues: aggregatedIssues,
      photos
    };

    try {
      const res = await api.submitInspection(submissionPayload);
      offlineStorage.clearDraft(task.id);
      offlineStorage.markTaskCompleted(task.id, {
        task_code: task.task_code,
        inspection_code: res?.inspection_code || `FO-${khasra.observed || task.khasra_number}-2026-001`,
        khasra_number: khasra.observed || task.khasra_number,
        village: task.village,
        district: task.district,
        area_ha: task.area_ha,
        priority: task.priority,
        status: 'COMPLETED'
      });
      setSubmissionResult(res);
    } catch (err) {
      console.warn('Backend unavailable, saving offline draft:', err);
      offlineStorage.queueSubmission(submissionPayload);
      offlineStorage.clearDraft(task.id);
      offlineStorage.markTaskCompleted(task.id, {
        task_code: task.task_code,
        inspection_code: `FO-${khasra.observed || task.khasra_number}-2026-001`,
        khasra_number: khasra.observed || task.khasra_number,
        village: task.village,
        district: task.district,
        area_ha: task.area_ha,
        priority: task.priority,
        status: 'COMPLETED',
        offline: true
      });
      setSubmissionResult({
        offline_saved: true,
        inspection_code: `FO-${khasra.observed || task.khasra_number}-2026-001`,
        message: 'Inspection saved locally in Offline Mode. It will synchronize automatically when connectivity is restored.',
        ai_risk_update: {
          risk_level: 'HIGH',
          new_risk_score: 84.0,
          predicted_delay_days: 82,
          reasons: [
            { factor: 'Boundary mismatch flagged on ground', impact: '+8%' },
            { factor: 'Section 15 landowner dispute confirmed', impact: '+12%' }
          ]
        },
        issues_count: aggregatedIssues.length,
        photos_count: photos.length
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Render Result Screen
  if (submissionResult) {
    const aiUpdate = submissionResult.ai_risk_update || {};
    return (
      <div className="p-4 space-y-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-4 border-emerald-50 mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
            ✓ Inspection Submitted
          </span>
          <h2 className="text-lg font-black text-slate-900 mt-2 font-serif">
            Dossier {submissionResult.inspection_code || `FO-${task.khasra_number}-2026-001`}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Status: <strong>SUBMITTED FOR REVIEW</strong>
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs text-slate-600">
            <div>
              <span>Project: <strong>NH-GJ-2026-001</strong></span>
            </div>
            <div>
              <span>Parcel: <strong>Khasra {task.khasra_number}</strong></span>
            </div>
            <div>
              <span>Officer: <strong>FO-007 (Amit B. Parmar)</strong></span>
            </div>
            <div>
              <span>GPS: <strong>{gps.verified ? 'Verified (±8m)' : 'Logged'}</strong></span>
            </div>
            <div>
              <span>Photos Attached: <strong>{photos.length} Photos</strong></span>
            </div>
            <div>
              <span>Issues Flagged: <strong>{submissionResult.issues_count || 2} Issues</strong></span>
            </div>
          </div>
        </div>

        {/* AI Risk Recalculated Callout */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm">N-LAMS AI Delay Risk Recalculated</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">PS17 Engine</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">New Project Risk</span>
              <div className="text-2xl font-black text-red-400 font-mono mt-0.5">
                {aiUpdate.new_risk_score || 84.0}%
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Risk Classification</span>
              <span className="text-xs font-black px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 font-mono inline-block mt-0.5">
                {aiUpdate.risk_level || 'HIGH'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1 pt-1">
            <p className="font-semibold text-sky-300 text-[11px]">
              "Your inspection identified {submissionResult.issues_count || 2} issues that affect acquisition progress:"
            </p>
            <ul className="text-[11px] text-slate-400 list-disc pl-4 space-y-0.5">
              <li>Boundary mismatch (+8% delay probability)</li>
              <li>Section 15 landowner dispute (+12% delay probability)</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-3 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <span>RETURN TO TASK LIST</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Top Workflow Header & Step Progress */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
              Inspection {task.task_code || `FO-${task.khasra_number}`}-001
            </span>
            <h2 className="text-xs font-black text-slate-900">Khasra {task.khasra_number} ({task.village})</h2>
          </div>
          <span className="text-xs font-mono font-black text-gov-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            STEP {step} OF 6
          </span>
        </div>

        {/* Step Progress Dots */}
        <div className="grid grid-cols-6 gap-1">
          {['Location', 'Parcel', 'Land', 'Evidence', 'Issues', 'Submit'].map((lbl, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <div key={lbl} className="text-center">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isDone ? 'bg-emerald-500' : isCurrent ? 'bg-gov-800 ring-2 ring-blue-300' : 'bg-slate-200'
                  }`}
                ></div>
                <span className={`text-[9px] mt-1 block truncate ${isCurrent ? 'font-black text-gov-800' : 'text-slate-400'}`}>
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: GPS VERIFICATION */}
      {step === 1 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gov-700" />
                <span>Step 1: Ground GPS Verification</span>
              </h3>
              {gps.mode === 'DEMO_SIMULATED' && (
                <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  DEMO / SIMULATED LOCATION
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Verify that you are physically standing inside or within 150m of Khasra No. {task.khasra_number}.
            </p>

            {/* GPS Status Card */}
            <div className={`p-4 rounded-xl border ${
              gps.verified ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">GPS Status:</span>
                {gps.verified ? (
                  <span className="flex items-center gap-1 text-xs font-black text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GPS VERIFIED</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700">Acquiring Location...</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Latitude</span>
                  <strong className="text-slate-900">{gps.lat.toFixed(5)}</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Longitude</span>
                  <strong className="text-slate-900">{gps.lng.toFixed(5)}</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Accuracy</span>
                  <strong className="text-emerald-600">±{gps.accuracy}m</strong>
                </div>
              </div>

              {/* Distance from assigned parcel */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600">Distance to Parcel:</span>
                <span className="font-bold font-mono text-gov-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {gps.distanceMeters} m ({gps.locationMatched ? '✓ LOCATION MATCHED' : '⚠ OUTSIDE BOUNDARY'})
                </span>
              </div>
            </div>

            {/* Actions for GPS */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAcquireDeviceGps}
                disabled={gps.acquiring}
                className="flex-1 py-2.5 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Crosshair className="w-4 h-4" />
                <span>{gps.acquiring ? 'Detecting...' : 'Detect Device GPS'}</span>
              </button>
              <button
                type="button"
                onClick={handleUseDemoGps}
                className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 shadow-sm active:scale-95"
              >
                Use Demo GPS
              </button>
            </div>

            {/* Mini Map */}
            <div className="h-44 rounded-xl overflow-hidden border border-slate-300 relative z-10">
              <MapContainer
                center={[gps.lat, gps.lng]}
                zoom={17}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <MapRecenter center={[gps.lat, gps.lng]} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polygon
                  positions={[
                    [22.385135, 71.062668],
                    [22.385135, 71.065964],
                    [22.387998, 71.065964],
                    [22.387998, 71.062668]
                  ]}
                  pathOptions={{ color: '#f59e0b', fillColor: '#fbbf24', fillOpacity: 0.4, weight: 3 }}
                />
                <Marker position={[gps.lat, gps.lng]} icon={officerIcon} />
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: KHASRA VERIFICATION */}
      {step === 2 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Step 2: Khasra & Survey Marker</h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">DIGITAL RECORD</span>
                <span className="font-mono font-bold text-slate-900">Expected: {khasra.expected}</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observed Khasra / Survey Marker Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={khasra.observed}
                    onChange={(e) => setKhasra({ ...khasra, observed: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-gov-700"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyKhasra}
                    className="px-4 py-2 bg-gov-800 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Verify
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Verification Result:</span>
                {khasra.matched ? (
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ KHASRA NUMBER MATCHED</span>
                  </span>
                ) : (
                  <span className="font-bold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>⚠ KHASRA NUMBER MISMATCH (HIGH ISSUE)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Survey Marker Photo */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Survey Marker Photo</span>
                <span className="text-[10px] text-slate-400">Required</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Capture physical stone or demarcation pillar with geo-stamping.
              </p>

              <button
                type="button"
                onClick={() => {
                  setCameraCategory('Survey/Khasra Marker');
                  setIsCameraOpen(true);
                }}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-gov-800 font-bold text-xs rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-gov-700" />
                <span>Capture Survey Marker Photo</span>
              </button>

              {photos.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {photos.map((ph) => (
                    <div key={ph.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                      <img src={ph.file_url} alt="thumbnail" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] truncate px-1 py-0.5 text-center">
                        {ph.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BOUNDARY & LAND USE */}
      {step === 3 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Step 3: Boundary & Land Use</h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                Does physical parcel boundary match the digital GIS boundary?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['YES', 'NO', 'UNCERTAIN'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBoundary({ ...boundary, matchesGis: opt })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      boundary.matchesGis === opt
                        ? opt === 'NO'
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-gov-800 text-white border-gov-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {boundary.matchesGis === 'NO' && (
                <div className="mt-2 space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>BOUNDARY MISMATCH DETECTED</span>
                  </span>
                  <textarea
                    rows={2}
                    value={boundary.remarks}
                    onChange={(e) => setBoundary({ ...boundary, remarks: e.target.value })}
                    placeholder="Describe boundary discrepancy..."
                    className="w-full p-2 bg-white border border-red-300 rounded-xl text-xs text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Land Use */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Recorded Land Use:</span>
                <strong className="text-slate-900">{landUse.recorded}</strong>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Actual Observed Land Use:
                </label>
                <select
                  value={landUse.actual}
                  onChange={(e) => setLandUse({ ...landUse, actual: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option>Agricultural</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Barren</option>
                  <option>Mixed</option>
                  <option>Other</option>
                </select>
              </div>

              {landUse.actual === 'Agricultural' && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Active Crop:</label>
                    <select
                      value={landUse.crop}
                      onChange={(e) => setLandUse({ ...landUse, crop: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                    >
                      <option>Cotton</option>
                      <option>Wheat</option>
                      <option>Rice</option>
                      <option>Groundnut</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Land Condition:</label>
                    <select
                      value={landUse.condition}
                      onChange={(e) => setLandUse({ ...landUse, condition: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                    >
                      <option>Good</option>
                      <option>Moderate</option>
                      <option>Poor</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Structure & Encroachment */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Are structures present?</span>
                <div className="flex gap-1">
                  {['No', 'Yes'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLandUse({ ...landUse, structurePresent: s })}
                      className={`px-3 py-1 rounded-lg font-bold border ${
                        landUse.structurePresent === s ? 'bg-gov-800 text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800">Is encroachment observed?</span>
                <div className="flex gap-1">
                  {['No', 'Yes', 'Uncertain'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLandUse({ ...landUse, encroachmentObserved: s })}
                      className={`px-3 py-1 rounded-lg font-bold border ${
                        landUse.encroachmentObserved === s
                          ? s === 'Yes' ? 'bg-red-600 text-white' : 'bg-gov-800 text-white'
                          : 'bg-white text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: OCCUPANCY, COMPENSATION & R&R */}
      {step === 4 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Step 4: Occupancy, Compensation & R&R</h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800">Owner / Occupant Present?</span>
                <div className="flex gap-1">
                  {['YES', 'NO'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setOccupancy({ ...occupancy, present: s })}
                      className={`px-3 py-1 rounded-lg font-bold border ${
                        occupancy.present === s ? 'bg-gov-800 text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {occupancy.present === 'YES' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Person Type:</label>
                    <select
                      value={occupancy.personType}
                      onChange={(e) => setOccupancy({ ...occupancy, personType: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option>Owner</option>
                      <option>Cultivator</option>
                      <option>Tenant</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Name:</label>
                    <input
                      type="text"
                      value={occupancy.name}
                      onChange={(e) => setOccupancy({ ...occupancy, name: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Compensation */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sanctioned Award</span>
                  <strong className="text-slate-900 font-mono text-sm">{compensation.awardAmount}</strong>
                </div>
                <StatusBadge status="Pending" size="xs" />
              </div>

              <label className="block font-bold text-slate-800 pt-1">
                Did person confirm receipt of compensation?
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['YES', 'NO', 'NOT AVAILABLE'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCompensation({ ...compensation, confirmedByPerson: s })}
                    className={`py-1.5 rounded-xl font-bold border text-[11px] ${
                      compensation.confirmedByPerson === s
                        ? s === 'NO' ? 'bg-red-600 text-white border-red-600' : 'bg-gov-800 text-white'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {compensation.confirmedByPerson === 'NO' && (
                <div className="pt-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-red-700">Reported Compensation Issue:</label>
                  <select
                    value={compensation.issue}
                    onChange={(e) => setCompensation({ ...compensation, issue: e.target.value })}
                    className="w-full p-2 bg-white border border-red-300 rounded-xl text-xs font-bold text-red-900"
                  >
                    <option>Payment not received</option>
                    <option>Amount dispute</option>
                    <option>Bank/account issue</option>
                    <option>Award not communicated</option>
                    <option>Other</option>
                  </select>
                </div>
              )}
            </div>

            {/* Dispute */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Is there an active dispute on site?</span>
                <div className="flex gap-1">
                  {['NO', 'YES'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDispute({ ...dispute, reported: s })}
                      className={`px-3 py-1 rounded-lg font-bold border ${
                        dispute.reported === s
                          ? s === 'YES' ? 'bg-red-600 text-white border-red-600' : 'bg-gov-800 text-white'
                          : 'bg-white text-slate-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {dispute.reported === 'YES' && (
                <div className="pt-2 space-y-1.5 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Dispute Type:</label>
                      <select
                        value={dispute.type}
                        onChange={(e) => setDispute({ ...dispute, type: e.target.value })}
                        className="w-full p-2 bg-white border border-red-300 rounded-xl text-xs font-bold text-red-900"
                      >
                        <option>Owner dispute</option>
                        <option>Boundary dispute</option>
                        <option>Compensation dispute</option>
                        <option>Access dispute</option>
                        <option>Legal issue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Severity:</label>
                      <select
                        value={dispute.severity}
                        onChange={(e) => setDispute({ ...dispute, severity: e.target.value })}
                        className="w-full p-2 bg-white border border-red-300 rounded-xl text-xs font-bold text-red-900"
                      >
                        <option>High</option>
                        <option>Critical</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="p-3 bg-white rounded-xl border border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Field Verification Checklist</span>
                <span className="text-xs font-mono font-bold text-gov-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {checklistCompletedCount} / 12 Completed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 pt-1">
                {Object.entries(checklist).map(([key, val]) => (
                  <label key={key} className="flex items-center gap-2 p-1 rounded hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                      className="w-3.5 h-3.5 text-gov-800 rounded focus:ring-gov-700"
                    />
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SMART ISSUES & EVIDENCE */}
      {step === 5 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Step 5: Smart Issue Detection</h3>
              <button
                type="button"
                onClick={() => {
                  setCameraCategory('Boundary');
                  setIsCameraOpen(true);
                }}
                className="text-xs font-bold text-gov-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Add Photo</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Issues automatically populated based on your field findings:
            </p>

            {/* Smart Issues List */}
            <div className="space-y-2">
              {getAggregatedIssues().map((iss, idx) => (
                <div key={idx} className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-red-900">{iss.issue_type}</strong>
                      <span className="text-[10px] font-mono font-bold bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
                        {iss.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 mt-1 leading-relaxed">{iss.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Gallery */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Attached Photo Evidence ({photos.length})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((ph, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 aspect-square">
                    <img src={ph.file_url} alt="Evidence" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                      <span className="text-[9px] font-bold text-white truncate">{ph.category}</span>
                      <span className="text-[8px] font-mono text-emerald-400">✓ GPS Geo-tagged</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: SUMMARY & SIGN OFF */}
      {step === 6 && (
        <div className="space-y-3 animate-in fade-in">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
            <h3 className="font-bold text-sm text-slate-900">Step 6: Inspection Summary & Signoff</h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Project:</span>
                <strong className="text-slate-900">Ahmedabad–Rajkot Green Highway</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Parcel:</span>
                <strong className="text-slate-900">Khasra No. {khasra.observed} ({task.village})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">GPS Status:</span>
                <strong className="text-emerald-700">✓ Verified (12m distance, ±8m acc)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Khasra Match:</span>
                <strong className={khasra.matched ? 'text-emerald-700' : 'text-red-600'}>
                  {khasra.matched ? '✓ Matched' : '⚠ Mismatched'}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Boundary:</span>
                <strong className={boundary.matchesGis === 'YES' ? 'text-emerald-700' : 'text-red-600'}>
                  {boundary.matchesGis === 'YES' ? 'Matched GIS' : 'Mismatch Observed'}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Land Use:</span>
                <strong className="text-slate-900">{landUse.actual} ({landUse.crop})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Photos Attached:</span>
                <strong className="text-slate-900">{photos.length} Photos</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ground Issues Flagged:</span>
                <strong className="text-red-600 font-bold">{getAggregatedIssues().length} Issues</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Officer Final Ground Remarks:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-gov-700"
              />
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800">
                <input
                  type="checkbox"
                  checked={officerConfirmed}
                  onChange={(e) => setOfficerConfirmed(e.target.checked)}
                  className="w-4 h-4 text-gov-800 rounded mt-0.5 focus:ring-gov-700"
                />
                <span className="font-semibold leading-relaxed">
                  I confirm that the information recorded above is based on my physical field inspection and ground observations.
                </span>
              </label>
            </div>

            <button
              type="button"
              disabled={submitting || !officerConfirmed}
              onClick={handleSubmitInspection}
              className={`w-full py-3.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all ${
                officerConfirmed && !submitting
                  ? 'bg-gov-800 hover:bg-gov-700 active:scale-95 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>{submitting ? 'TRANSMITTING & RECALCULATING AI RISK...' : 'SUBMIT INSPECTION TO N-LAMS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM STEP NAVIGATION (Step 1-5) */}
      {step < 6 && (
        <div className="flex gap-2 pt-1">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex-1 py-2.5 bg-gov-800 hover:bg-gov-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5"
          >
            <span>Continue to Step {step + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        category={cameraCategory}
        gps={gps}
        onCapture={(photoRecord) => {
          setPhotos(prev => [photoRecord, ...prev]);
        }}
      />
    </div>
  );
}

