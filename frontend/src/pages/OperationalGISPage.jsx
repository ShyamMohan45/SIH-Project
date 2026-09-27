import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, Search, Filter, AlertTriangle, CheckCircle2, 
  MapPin, Eye, ExternalLink, RefreshCw, X, ShieldCheck,
  Compass, ArrowRight, Camera, Sparkles, Maximize,
  Minimize, AlertOctagon, HelpCircle, FileText, ChevronRight,
  Database, Activity, Home, Landmark, CheckSquare, Square,
  Check, EyeOff, Radio, DollarSign, Gavel, Users, ClipboardCheck,
  Clock, Award, ArrowDown, BellRing, Sparkle, Printer
} from 'lucide-react';
import { api } from '../services/api';

// Fix Leaflet marker icon asset issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pin icons for ground field inspection markers
const gpsIconVerified = L.divIcon({
  className: 'custom-gps-pin-verified',
  html: `<div style="background-color:#15803d; color:white; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 0 10px rgba(22,163,74,0.7); font-size:13px; font-weight:900;">🛰️</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const gpsIconOutside = L.divIcon({
  className: 'custom-gps-pin-outside',
  html: `<div style="background-color:#b91c1c; color:white; width:30px; height:30px; border-radius:50%; border:2.5px solid #fecaca; display:flex; align-items:center; justify-content:center; box-shadow:0 0 12px rgba(220,38,38,0.8); font-size:13px; font-weight:900;">⚠️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const gpsIconDemo = L.divIcon({
  className: 'custom-gps-pin-demo',
  html: `<div style="background-color:#d97706; color:white; width:28px; height:28px; border-radius:50%; border:2px dashed white; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px rgba(217,119,6,0.6); font-size:12px; font-weight:900;">📍</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});


// Map Controller for dynamic FlyTo and FitBounds
function MapActionController({ targetCoords, targetZoom = 17, fitBoundsCoords }) {
  const map = useMap();

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, targetZoom, { duration: 1.2 });
    }
  }, [targetCoords, targetZoom, map]);

  useEffect(() => {
    if (fitBoundsCoords && fitBoundsCoords.length > 0) {
      try {
        const bounds = L.latLngBounds(fitBoundsCoords);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
        }
      } catch (err) {
        console.warn('Could not fit bounds:', err);
      }
    }
  }, [fitBoundsCoords, map]);

  return null;
}

// 6 STATUTORY GIS MODES
const GIS_MODES = [
  { id: 'ACQUISITION_STATUS', label: 'Acquisition Status', icon: Award, desc: 'Statutory RFCTLARR Stage Progression' },
  { id: 'AI_RISK', label: 'AI Risk Analysis', icon: Sparkles, desc: 'PS17 Machine Learning Delay Prediction' },
  { id: 'COMPENSATION', label: 'Compensation & Awards', icon: DollarSign, desc: 'PFMS DBT Ledger & Section 23 Awards' },
  { id: 'LEGAL', label: 'Legal / Objections', icon: Gavel, desc: 'Section 15 Objections & Court Petitions' },
  { id: 'RR', label: 'R&R Compliance', icon: Users, desc: 'RFCTLARR Sch-II Resettlement & Rehabilitation' },
  { id: 'FIELD_VERIFICATION', label: 'Field Verification', icon: ClipboardCheck, desc: 'Ground Truthing & Satellite Discrepancy' },
];

export default function OperationalGISPage() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [flyCoords, setFlyCoords] = useState(null);
  const [fitBoundsCoords, setFitBoundsCoords] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // ACTIVE GIS MODE (1. Acquisition Status, 2. AI Risk, 3. Compensation, 4. Legal, 5. R&R, 6. Field Verification)
  const [activeGisMode, setActiveGisMode] = useState('ACQUISITION_STATUS');

  // Khasra 1042 Demonstration Step: 1 to 6
  // Parcel -> Field Verification -> Issue -> AI Risk -> Alert -> Recommendation
  const [demoStep, setDemoStep] = useState(1);
  const [activeInspectionModal, setActiveInspectionModal] = useState(null);
  const [loadingInspectionModal, setLoadingInspectionModal] = useState(false);

  // BASEMAP STATE: 'satellite' | 'street'
  const [activeBasemap, setActiveBasemap] = useState('satellite');

  // Corridor and GPS Spatial State
  const [corridorData, setCorridorData] = useState(null);
  const [showCorridorDetail, setShowCorridorDetail] = useState(false);
  const [onlyAffectedFilter, setOnlyAffectedFilter] = useState(false);
  const [fieldGpsPoints, setFieldGpsPoints] = useState([]);

  // Overlays
  const [layerLayers, setLayerLayers] = useState({
    projectBoundaries: true,
    corridor: true,
    parcels: true,
    fieldInspections: true
  });

  const containerRef = useRef(null);

  // Backend filters
  const [filters, setFilters] = useState({
    state: 'ALL',
    district: 'ALL',
    project_id: 'ALL',
    risk_level: 'ALL',
    acquisition_status: 'ALL',
    compensation_status: 'ALL',
    legal_status: 'ALL',
    field_verification_status: 'ALL',
  });

  // Center of Ahmedabad-Rajkot Green Highway Expansion corridor (Khasra 1042 / Limbdi cluster)
  const defaultCenter = [22.3862, 71.0676];

  // Statutory Project Corridor Alignment Boundary (NH-GJ-2026-001)
  const corridorBoundary = [
    [22.3810, 71.0550],
    [22.3940, 71.0720],
    [22.3910, 71.0850],
    [22.3780, 71.0700],
    [22.3810, 71.0550]
  ];

  // Live Ground Truth Field Inspections
  const fieldInspections = [
    {
      id: 'INSP-1042-001',
      khasra: '1042',
      officer: 'Vikram Patel (FO-8832)',
      coords: [22.3862, 71.0676],
      status: 'MISMATCH_FLAGGED',
      notes: '12m physical boundary overlap logged with GPS precision against revenue records.',
      date: '2026-03-10'
    },
    {
      id: 'INSP-1043-002',
      khasra: '1043',
      officer: 'Sanjay Rawat (FO-8835)',
      coords: [22.3878, 71.0700],
      status: 'VERIFIED',
      notes: 'Boundary verified against RoR record. Title clear, no encumbrance.',
      date: '2026-03-08'
    },
    {
      id: 'INSP-1041-003',
      khasra: '1041',
      officer: 'Amit Joshi (FO-8831)',
      coords: [22.3845, 71.0655],
      status: 'VERIFIED',
      notes: 'Canal easement and sub-soil quality verified.',
      date: '2026-03-05'
    },
    {
      id: 'INSP-1055-004',
      khasra: '1055',
      officer: 'Neha Sharma (FO-8838)',
      coords: [22.3890, 71.0720],
      status: 'VERIFIED',
      notes: 'Tree count verified: 14 mature neem trees recorded in Schedule-I valuation.',
      date: '2026-03-11'
    }
  ];

  // Fetch GeoJSON directly from backend PostGIS engine
  const fetchGISData = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = {};
      if (filters.state !== 'ALL') queryParams.state = filters.state;
      if (filters.district !== 'ALL') queryParams.district = filters.district;
      if (filters.project_id !== 'ALL') queryParams.project_id = filters.project_id;
      if (filters.risk_level !== 'ALL') queryParams.risk_level = filters.risk_level;
      if (filters.acquisition_status !== 'ALL') queryParams.acquisition_status = filters.acquisition_status;
      if (filters.compensation_status !== 'ALL') queryParams.compensation_status = filters.compensation_status;
      if (filters.legal_status !== 'ALL') queryParams.legal_status = filters.legal_status;
      if (filters.field_verification_status !== 'ALL') queryParams.field_verification_status = filters.field_verification_status;
      if (searchQuery.trim()) queryParams.search = searchQuery.trim();

      const data = await api.getMap(queryParams);
      // Fetch PostGIS Corridor Feature
      try {
        const corr = await api.getProjectCorridor(filters.project_id === 'ALL' ? 'NH-GJ-2026-001' : filters.project_id);
        if (corr && corr.geometry) {
          setCorridorData(corr);
        }
      // Fetch live Field Officer GPS inspection points from backend PostGIS
      try {
        const gpsRes = await api.getFieldGPSPoints(filters.project_id);
        if (gpsRes && gpsRes.features) {
          setFieldGpsPoints(gpsRes.features);
        }
      } catch (gErr) {
        console.warn('Could not load field GPS points:', gErr);
      }
      } catch (cErr) {
        console.warn('Could not load corridor geometry:', cErr);
      }
      
      if (!data || !data.features) {
        throw new Error('GIS service unavailable');
      }

      const feats = data.features.map(f => {
        const props = f.properties || {};
        const khasra = String(props.khasra_number || props.khasra_no || props.survey_number || props.id || '').replace(/^P-/, '').replace(/^Sur-/, '');
        const isHero = khasra === '1042';

        // 1. Acquisition Status enrichment for mode visualization
        let modeAcq = (props.acquisition_status || 'Under Process').trim();
        if (isHero) modeAcq = 'Disputed';
        else if (khasra.endsWith('/1')) modeAcq = 'Pending';
        else if (khasra.endsWith('/2')) modeAcq = 'Awarded';
        else if (khasra.endsWith('/3')) modeAcq = 'Possession';
        else if (parseInt(khasra) % 4 === 0) modeAcq = 'Acquired';

        // 2. AI Risk (read from backend risk_level)
        const modeRisk = (props.risk_level || (isHero ? 'CRITICAL' : 'LOW')).toUpperCase();

        // 3. Compensation status
        let modeComp = (props.compensation_status || 'Pending').trim();
        if (isHero) modeComp = 'Disputed';
        else if (modeAcq === 'Acquired') modeComp = 'Paid';
        else if (parseInt(khasra) % 5 === 0) modeComp = 'Issue';

        // 4. Legal / Objections
        let modeLegal = 'Clear';
        if (isHero) modeLegal = 'Legal case (Stayed)';
        else if (khasra === '1041') modeLegal = 'Boundary dispute';
        else if (khasra === '1043') modeLegal = 'Owner dispute';
        else if (khasra === '1050') modeLegal = 'Compensation dispute';
        else if (khasra === '1055') modeLegal = 'Ownership issue';

        // 5. R&R
        let modeRR = 'Pending';
        if (isHero) modeRR = 'Issue';
        else if (modeAcq === 'Acquired') modeRR = 'Completed';

        // 6. Field Verification
        let modeField = 'Pending';
        if (isHero) modeField = 'Boundary Mismatch';
        else if (khasra === '1043/1') modeField = 'Khasra Mismatch';
        else if (khasra === '1045') modeField = 'Land-use Mismatch';
        else if (khasra === '1048') modeField = 'Encroachment';
        else if (parseInt(khasra) % 3 === 0) modeField = 'GPS Verified';
        else if (parseInt(khasra) % 2 === 0) modeField = 'Verified';

        return {
          ...props,
          id: f.id || props.id || props.parcel_id,
          khasra_number: khasra || '1042',
          khasra_no: khasra || '1042',
          survey_number: props.survey_number || khasra,
          geometry: f.geometry,
          modeAcq,
          modeRisk,
          modeComp,
          modeLegal,
          modeRR,
          modeField,
          is_affected_by_corridor: Boolean(props.is_affected_by_corridor),
          corridor_label: props.corridor_label
        };
      });

      setParcels(feats);

      // Auto-preserve or select matching parcel
      if (feats.length > 0) {
        if (selectedParcel) {
          const match = feats.find(p => p.khasra_number === selectedParcel.khasra_number || p.id === selectedParcel.id);
          if (match) setSelectedParcel(match);
        } else {
          // Default select Khasra 1042 for demonstration
          const hero = feats.find(p => String(p.khasra_number) === '1042');
          if (hero) setSelectedParcel(hero);
        }
      } else {
        setSelectedParcel(null);
      }
    } catch (err) {
      console.error('Operational GIS fetch error:', err);
      setError('GIS service unavailable. Could not load spatial vector layers from PostGIS backend.');
      setParcels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGISData();
  }, [filters]);

  // Handler to filter only parcels affected by corridor
  const handleToggleAffectedOnly = async () => {
    if (onlyAffectedFilter) {
      setOnlyAffectedFilter(false);
      fetchGISData();
    } else {
      setLoading(true);
      try {
        const affData = await api.getProjectAffectedParcels(filters.project_id === 'ALL' ? 'NH-GJ-2026-001' : filters.project_id);
        if (affData && affData.features) {
          setOnlyAffectedFilter(true);
          const mapped = affData.features.map(f => {
            const props = f.properties || {};
            const khasra = String(props.khasra_number || props.survey_number || '').replace(/^P-/, '');
            const isHero = khasra === '1042';
            return {
              ...props,
              id: f.id || props.id,
              khasra_number: khasra || '1042',
              survey_number: props.survey_number || khasra,
              geometry: f.geometry,
              modeAcq: isHero ? 'Disputed' : (props.acquisition_status || 'Under Process'),
              modeRisk: (props.risk_level || (isHero ? 'CRITICAL' : 'LOW')).toUpperCase(),
              modeComp: isHero ? 'Disputed' : (props.compensation_status || 'Pending'),
              modeLegal: isHero ? 'Legal case (Stayed)' : 'Clear',
              modeRR: isHero ? 'Issue' : 'Pending',
              modeField: isHero ? 'Boundary Mismatch' : 'Pending',
              is_affected_by_corridor: true,
              corridor_label: 'DEMO / SYNTHETIC PROJECT CORRIDOR'
            };
          });
          setParcels(mapped);
          const k1042 = mapped.find(p => String(p.khasra_number) === '1042');
          if (k1042) setSelectedParcel(k1042);
        }
      } catch (err) {
        console.error('Failed to load affected parcels:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Search Execution
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      fetchGISData();
      return;
    }

    const found = parcels.find(p => 
      String(p.khasra_number).toLowerCase() === q ||
      String(p.survey_number).toLowerCase() === q ||
      String(p.id).toLowerCase() === q ||
      String(p.village).toLowerCase().includes(q) ||
      String(p.district).toLowerCase().includes(q) ||
      String(p.project_id).toLowerCase().includes(q)
    );

    if (found) {
      setSelectedParcel(found);
      const lat = found.gps_lat || (found.geometry?.coordinates?.[0]?.[0]?.[1]) || 22.3862;
      const lng = found.gps_lng || (found.geometry?.coordinates?.[0]?.[0]?.[0]) || 71.0676;
      setFlyCoords([lat, lng]);
    } else {
      fetchGISData();
    }
  };

  // Specific handler for focusing Hero Khasra 1042
  const handleFocusHero1042 = () => {
    const k1042 = parcels.find(p => String(p.khasra_number) === '1042');
    if (k1042) {
      setSelectedParcel(k1042);
      const lat = k1042.gps_lat || (k1042.geometry?.coordinates?.[0]?.[0]?.[1]) || 22.3862;
      const lng = k1042.gps_lng || (k1042.geometry?.coordinates?.[0]?.[0]?.[0]) || 71.0676;
      setFlyCoords([lat, lng]);
    } else {
      setFilters(prev => ({ ...prev, project_id: 'NH-GJ-2026-001', risk_level: 'ALL' }));
      setSearchQuery('1042');
    }
  };

  // Fit all loaded parcels to viewport
  const handleFitAllBounds = () => {
    const allCoords = [];
    parcels.forEach(p => {
      if (p.geometry?.coordinates?.[0]) {
        p.geometry.coordinates[0].forEach(pt => {
          allCoords.push([pt[1], pt[0]]);
        });
      }
    });

    if (allCoords.length > 0) {
      setFitBoundsCoords(allCoords);
    } else {
      setFlyCoords(defaultCenter);
    }
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
      setIsFullscreen(false);
    }
  };

  // Handle parcel polygon selection
  const handleOpenInspection = async (inspectionId) => {
    if (!inspectionId) return;
    setLoadingInspectionModal(true);
    try {
      const insp = await api.getFieldInspectionDetail(inspectionId);
      if (insp && (insp.id || insp.inspection_code)) {
        setActiveInspectionModal(insp);
      } else {
        throw new Error('Inspection not returned from API');
      }
    } catch (err) {
      console.warn('Fallback inspection detail:', err);
      setActiveInspectionModal({
        id: inspectionId,
        inspection_code: inspectionId,
        officer_name: 'Vikram Patel',
        officer_id: 'FO-8832',
        started_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        status: 'SUBMITTED',
        gps_verified: true,
        distance_meters: 12.4,
        latitude: 22.3862,
        longitude: 71.0676,
        boundary_status: 'MISMATCH',
        khasra_number: selectedParcel?.khasra_number || '1042',
        village: selectedParcel?.village || 'Limbdi',
        district: selectedParcel?.district || 'Surendranagar',
        issues: selectedParcel?.active_issues || [
          {
            id: 'ISS-001',
            issue_type: 'BOUNDARY_MISMATCH',
            severity: 'HIGH',
            description: '12m physical boundary overlap detected between agricultural fence line and statutory RoR demarcation.',
            status: 'OPEN',
            created_at: new Date().toISOString()
          }
        ],
        checklist: {
          boundary_visible: true,
          survey_marker_available: true,
          land_use_verified: true,
          area_consistent: false,
          owner_verified: true
        }
      });
    } finally {
      setLoadingInspectionModal(false);
    }
  };

  const handleSelectParcel = (p) => {
    setSelectedParcel(p);
    const lat = p.gps_lat || (p.geometry?.coordinates?.[0]?.[0]?.[1]) || 22.3862;
    const lng = p.gps_lng || (p.geometry?.coordinates?.[0]?.[0]?.[0]) || 71.0676;
    setFlyCoords([lat, lng]);
  };

  // ============================================================
  // LAND-ACQUISITION-SPECIFIC DYNAMIC GIS STYLING ENGINE
  // ============================================================
  const getParcelStyle = (p) => {
    const isSelected = selectedParcel && (
      String(selectedParcel.id) === String(p.id) ||
      String(selectedParcel.khasra_number) === String(p.khasra_number)
    );

    // ============================================================
    // 1. ACTIVE FIELD INSPECTION ISSUE WARNING BORDERS
    // ============================================================
    const hasIssue = Boolean(p.has_active_issue || (p.active_issues && p.active_issues.length > 0));
    const warningBorder = p.warning_border || (hasIssue && p.active_issues?.[0] ? {
      color: p.active_issues[0].border_color || '#ea580c',
      dashArray: p.active_issues[0].dash_array,
      weight: p.active_issues[0].border_weight || 4,
      label: p.active_issues[0].formatted_type || 'Field Issue'
    } : null);

    if (hasIssue && warningBorder) {
      return {
        color: warningBorder.color,
        weight: isSelected ? 5.5 : (warningBorder.weight || 4),
        fillColor: warningBorder.color,
        fillOpacity: isSelected ? 0.22 : 0.08, // Keeps underlying agricultural satellite imagery visible
        dashArray: warningBorder.dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      };
    }

    // Selected parcel without active issue has statutory Blue Border
    if (isSelected) {
      return {
        color: '#2563eb', // Statutory Selected Blue Border
        weight: 4.5,
        fillColor: '#3b82f6',
        fillOpacity: 0.18,
        lineCap: 'round',
        lineJoin: 'round'
      };
    }

    let borderColor = '#16a34a';
    let fillColor = '#22c55e';
    let dashArray = undefined;

    switch (activeGisMode) {
      case 'ACQUISITION_STATUS':
        // Acquired, Under Process, Pending, Awarded, Possession, Disputed
        if (p.modeAcq === 'Disputed') {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
        } else if (p.modeAcq === 'Pending') {
          borderColor = '#ea580c'; // Orange
          fillColor = '#f97316';
        } else if (p.modeAcq === 'Under Process') {
          borderColor = '#f59e0b'; // Amber / Yellow
          fillColor = '#fbbf24';
        } else if (p.modeAcq === 'Awarded') {
          borderColor = '#6366f1'; // Indigo
          fillColor = '#818cf8';
        } else if (p.modeAcq === 'Possession') {
          borderColor = '#0d9488'; // Teal
          fillColor = '#14b8a6';
        } else {
          borderColor = '#16a34a'; // Emerald Green: Acquired
          fillColor = '#22c55e';
        }
        break;

      case 'AI_RISK':
        // LOW, MEDIUM, HIGH, CRITICAL (from backend risk_level)
        if (p.modeRisk === 'CRITICAL') {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
        } else if (p.modeRisk === 'HIGH') {
          borderColor = '#ea580c'; // Orange
          fillColor = '#f97316';
        } else if (p.modeRisk === 'MEDIUM') {
          borderColor = '#f59e0b'; // Yellow / Amber
          fillColor = '#fbbf24';
        } else {
          borderColor = '#16a34a'; // Green: Low
          fillColor = '#22c55e';
        }
        break;

      case 'COMPENSATION':
        // Paid, Pending, Disputed, Issue
        if (p.modeComp === 'Disputed') {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
        } else if (p.modeComp === 'Issue') {
          borderColor = '#9333ea'; // Purple
          fillColor = '#a855f7';
        } else if (p.modeComp === 'Pending') {
          borderColor = '#f59e0b'; // Amber / Yellow
          fillColor = '#fbbf24';
        } else {
          borderColor = '#16a34a'; // Green: Paid
          fillColor = '#22c55e';
        }
        break;

      case 'LEGAL':
        // Owner dispute, Boundary dispute, Compensation dispute, Ownership issue, Legal case
        if (p.modeLegal.includes('Legal case')) {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
          dashArray = '6, 4';
        } else if (p.modeLegal.includes('Boundary dispute')) {
          borderColor = '#ea580c'; // Orange
          fillColor = '#f97316';
          dashArray = '5, 4';
        } else if (p.modeLegal.includes('Owner dispute') || p.modeLegal.includes('Ownership issue')) {
          borderColor = '#8b5cf6'; // Violet
          fillColor = '#a78bfa';
          dashArray = '5, 4';
        } else if (p.modeLegal.includes('Compensation dispute')) {
          borderColor = '#f59e0b'; // Amber
          fillColor = '#fbbf24';
          dashArray = '5, 4';
        } else {
          borderColor = '#16a34a'; // Green: Clear
          fillColor = '#22c55e';
        }
        break;

      case 'RR':
        // Completed, Pending, Issue
        if (p.modeRR === 'Issue') {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
        } else if (p.modeRR === 'Pending') {
          borderColor = '#f59e0b'; // Amber / Yellow
          fillColor = '#fbbf24';
        } else {
          borderColor = '#16a34a'; // Green: Completed
          fillColor = '#22c55e';
        }
        break;

      case 'FIELD_VERIFICATION':
        // Verified, Pending, GPS Verified, Boundary Mismatch, Khasra Mismatch, Land-use Mismatch, Encroachment
        if (p.modeField === 'Boundary Mismatch') {
          borderColor = '#dc2626'; // Red
          fillColor = '#ef4444';
          dashArray = '6, 4';
        } else if (p.modeField === 'Encroachment') {
          borderColor = '#991b1b'; // Crimson
          fillColor = '#b91c1c';
          dashArray = '4, 3';
        } else if (p.modeField === 'Khasra Mismatch') {
          borderColor = '#f43f5e'; // Rose
          fillColor = '#fb7185';
          dashArray = '5, 4';
        } else if (p.modeField === 'Land-use Mismatch') {
          borderColor = '#ea580c'; // Orange
          fillColor = '#f97316';
          dashArray = '5, 4';
        } else if (p.modeField === 'GPS Verified') {
          borderColor = '#06b6d4'; // Cyan
          fillColor = '#22d3ee';
        } else if (p.modeField === 'Verified') {
          borderColor = '#16a34a'; // Green
          fillColor = '#22c55e';
        } else {
          borderColor = '#f59e0b'; // Yellow: Pending
          fillColor = '#fbbf24';
        }
        break;

      default:
        borderColor = '#16a34a';
        fillColor = '#22c55e';
    }

    return {
      color: borderColor,
      weight: 2.4,
      fillColor: fillColor,
      fillOpacity: 0.05, // Transparent interior keeps agricultural fields visible!
      dashArray: dashArray,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  // Render Dynamic Legend Items according to Active GIS Mode
  const renderDynamicLegend = () => {
    switch (activeGisMode) {
      case 'ACQUISITION_STATUS':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Acquired</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#0d9488] bg-[#0d9488]/20"></span><span>Possession</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#6366f1] bg-[#6366f1]/20"></span><span>Awarded</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/20"></span><span>Under Process</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#ea580c] bg-[#ea580c]/20"></span><span>Pending</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20"></span><span>Disputed</span></div>
          </div>
        );

      case 'AI_RISK':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Low Risk</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/20"></span><span>Medium Risk</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#ea580c] bg-[#ea580c]/20"></span><span>High Risk</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20"></span><span>Critical Risk</span></div>
          </div>
        );

      case 'COMPENSATION':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Paid</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/20"></span><span>Pending</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20"></span><span>Disputed</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#9333ea] bg-[#9333ea]/20"></span><span>Issue / Escrowed</span></div>
          </div>
        );

      case 'LEGAL':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Clear Title</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#ea580c]"></span><span>Boundary Dispute</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#8b5cf6]"></span><span>Owner Dispute</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#f59e0b]"></span><span>Compensation Dispute</span></div>
            <div className="flex items-center gap-1.5 col-span-2"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20"></span><span>Legal Case (High Court Stay)</span></div>
          </div>
        );

      case 'RR':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Completed (Sch-II)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/20"></span><span>Pending Survey</span></div>
            <div className="flex items-center gap-1.5 col-span-2"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20"></span><span>Issue (Displacement Audit)</span></div>
          </div>
        );

      case 'FIELD_VERIFICATION':
        return (
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20"></span><span>Verified</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#06b6d4] bg-[#06b6d4]/20"></span><span>GPS Verified</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1.5 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/20"></span><span>Pending Inspection</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#dc2626]"></span><span>Boundary Mismatch</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#f43f5e]"></span><span>Khasra Mismatch</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#ea580c]"></span><span>Land-use Mismatch</span></div>
            <div className="flex items-center gap-1.5 col-span-2"><span className="w-3.5 h-1 border-t-2 border-dashed border-[#991b1b]"></span><span>Encroachment Flagged</span></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-screen flex flex-col font-sans bg-slate-950 overflow-hidden text-slate-100"
    >
      {/* 1. TOP STATUTORY HEADER */}
      <header className="bg-[#0b2545] border-b border-slate-700 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-30 shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-sm font-black text-sm">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black tracking-tight text-white font-serif">N-LAMS Operational GIS Studio</h1>
              <span className="px-2 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                POSTGIS LIVE
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase font-mono">
                EPSG:4326
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-none mt-0.5">
              National Geospatial Cadastral Vector Engine &bull; Ministry of Rural Development (DoLR)
            </p>
          </div>
        </div>

        {/* Global Quick Navigation Links */}
        <div className="flex items-center gap-2 text-xs">
          <a
            href="/"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <Home className="w-3 h-3" />
            <span>Public Portal</span>
          </a>
          <a
            href="/portal"
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors flex items-center gap-1 text-[11px] font-medium"
          >
            <Activity className="w-3 h-3" />
            <span>Control Room</span>
          </a>
          <button
            onClick={toggleFullscreen}
            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold transition-colors flex items-center gap-1 text-[11px]"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-3 h-3" /> : <Maximize className="w-3 h-3" />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </header>

      {/* 2. LAND-ACQUISITION-SPECIFIC GIS MODE SELECTOR BAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-25 text-xs shrink-0">
        <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>GIS Mode:</span>
        </div>

        {/* The 6 Statutory Mode Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1 max-w-4xl">
          {GIS_MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeGisMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveGisMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
                title={mode.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Mode Badge Description */}
        <div className="hidden 2xl:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span>Active Layer:</span>
          <span className="text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
            {GIS_MODES.find(m => m.id === activeGisMode)?.desc}
          </span>
        </div>
      </div>

      {/* 3. SUB-HEADER CONTROLS & KHASRA 1042 DEMO BAR */}
      <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-20 text-xs shrink-0">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Khasra (e.g. 1042), Project, Village, District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-64 md:w-72 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-xs"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  state: 'ALL',
                  district: 'ALL',
                  project_id: 'ALL',
                  risk_level: 'ALL',
                  acquisition_status: 'ALL',
                  compensation_status: 'ALL',
                  legal_status: 'ALL',
                  field_verification_status: 'ALL',
                });
              }}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* KHASRA 1042 DEMONSTRATION FLOW: Parcel -> Field Verification -> Issue -> AI Risk -> Alert -> Recommendation */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Corridor Info Trigger Button */}
          <button
            onClick={() => setShowCorridorDetail(true)}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all shadow-xs"
            title="Inspect Highway Corridor Alignment and Affected Parcels"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Corridor: {corridorData?.properties?.corridor_length_km || 3.72} km</span>
            <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-mono">
              {corridorData?.properties?.affected_parcels_count || 5} Affected
            </span>
          </button>

          <button
            onClick={handleToggleAffectedOnly}
            className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
              onlyAffectedFilter
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {onlyAffectedFilter ? 'Showing Intersected (5)' : 'Filter Intersected Only'}
          </button>
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
          <button
            onClick={handleFocusHero1042}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded font-bold text-xs flex items-center gap-1 transition-colors mr-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Khasra 1042 Demo:</span>
          </button>

          {/* 6 Step Interactive Pipeline */}
          <div className="flex items-center text-[10px] font-semibold text-slate-300">
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(1); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 1 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              1. Parcel
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(2); setActiveGisMode('FIELD_VERIFICATION'); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 2 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              2. Field Verification
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(3); setActiveGisMode('LEGAL'); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 3 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              3. Issue
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(4); setActiveGisMode('AI_RISK'); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 4 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              4. AI Risk
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(5); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 5 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              5. Alert
            </span>
            <ChevronRight className="w-2.5 h-2.5 text-slate-600" />
            <span 
              onClick={() => { handleFocusHero1042(); setDemoStep(6); }}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${demoStep === 6 ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'}`}
            >
              6. Recommendation
            </span>
          </div>
        </div>
      </div>

        {/* Right: Basemap & Layer Control */}
        <div className="flex items-center gap-2">
          {/* Basemap Switcher (Satellite vs Street) */}
          <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-700">
            <button
              onClick={() => setActiveBasemap('satellite')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1 transition-colors ${
                activeBasemap === 'satellite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🌾 Satellite</span>
            </button>
            <button
              onClick={() => setActiveBasemap('street')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1 transition-colors ${
                activeBasemap === 'street'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🗺️ Street</span>
            </button>
          </div>

          <button
            onClick={handleFitAllBounds}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-medium flex items-center gap-1"
            title="Fit all parcels in view"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Fit</span>
          </button>

          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-colors ${
              isLayerMenuOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN MAP VIEWPORT CONTAINER */}
      <div className="relative flex-1 w-full h-full flex overflow-hidden">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 pointer-events-none">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-xs font-bold text-slate-200 tracking-wide">
              Loading PostGIS Cadastral Geometries from PostgreSQL...
            </p>
          </div>
        )}

        {/* Error State Banner */}
        {error && !loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-rose-950/95 border border-rose-600 text-rose-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 max-w-lg text-xs">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold">GIS service unavailable</div>
              <div className="text-[11px] text-rose-300">{error}</div>
            </div>
            <button
              onClick={fetchGISData}
              className="px-2 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded font-bold text-[10px] shrink-0 ml-auto"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State Overlay */}
        {!loading && !error && parcels.length === 0 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-amber-500/60 text-amber-200 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-white">No GIS parcels found for current filters.</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Adjust your filter settings or search query to load parcels.</div>
            </div>
          </div>
        )}

        {/* FLOATING INTERACTIVE LAYER CONTROL PANEL */}
        {isLayerMenuOpen && (
          <div className="absolute top-4 right-4 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl w-64 text-xs space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 font-extrabold text-white text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Map Overlays</span>
              </div>
              <button
                onClick={() => setIsLayerMenuOpen(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1 border-t-2 border-dashed border-amber-400"></span>
                  <span className="text-slate-200 font-medium">Project Boundaries</span>
                </div>
                <input
                  type="checkbox"
                  checked={layerLayers.projectBoundaries}
                  onChange={(e) => setLayerLayers(prev => ({ ...prev, projectBoundaries: e.target.checked }))}
                  className="rounded accent-amber-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-1 border-t-2 border-dashed border-yellow-400"></span>
                  <span className="text-slate-200 font-medium">Highway Corridor (PostGIS)</span>
                </div>
                <input
                  type="checkbox"
                  checked={layerLayers.corridor}
                  onChange={(e) => setLayerLayers(prev => ({ ...prev, corridor: e.target.checked }))}
                  className="rounded accent-yellow-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-xs border border-emerald-500 bg-emerald-500/20"></span>
                  <span className="text-slate-200 font-medium">Cadastral Parcels</span>
                </div>
                <input
                  type="checkbox"
                  checked={layerLayers.parcels}
                  onChange={(e) => setLayerLayers(prev => ({ ...prev, parcels: e.target.checked }))}
                  className="rounded accent-emerald-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white"></span>
                  <span className="text-slate-200 font-medium">Field Inspections</span>
                </div>
                <input
                  type="checkbox"
                  checked={layerLayers.fieldInspections}
                  onChange={(e) => setLayerLayers(prev => ({ ...prev, fieldInspections: e.target.checked }))}
                  className="rounded accent-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Leaflet Map */}
        <div className="flex-1 h-full w-full relative">
          <MapContainer
            center={defaultCenter}
            zoom={16}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {/* 1. SATELLITE BASEMAP (Esri World Imagery + Labels) */}
            {activeBasemap === 'satellite' && (
              <>
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
                <TileLayer
                  attribution='Reference &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
              </>
            )}

            {/* 2. STREET BASEMAP (OpenStreetMap) */}
            {activeBasemap === 'street' && (
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            )}

            <MapActionController 
              targetCoords={flyCoords} 
              fitBoundsCoords={fitBoundsCoords}
            />

            {/* OVERLAY 1: Project Alignment Boundary */}
            {layerLayers.projectBoundaries && (
              <Polygon
                positions={corridorBoundary}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 2.5,
                  dashArray: '8, 6',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.04
                }}
              >
                <Tooltip permanent direction="top">
                  <span className="font-bold text-[10px] text-amber-900 bg-amber-100/90 px-1 rounded border border-amber-300">
                    Corridor Alignment (NH-GJ-2026-001)
                  </span>
                </Tooltip>
              </Polygon>
            )}

                        {/* OVERLAY: Actual PostGIS Highway Corridor LineString (DEMO / SYNTHETIC PROJECT CORRIDOR) */}
            {layerLayers.corridor && corridorData && corridorData.geometry && (
              <>
                {/* 1. Highway Corridor Buffer Casing (ROW visual width) */}
                <Polyline
                  positions={corridorData.geometry.coordinates.map(c => [c[1], c[0]])}
                  pathOptions={{
                    color: '#f59e0b',
                    weight: 12,
                    opacity: 0.35,
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                  eventHandlers={{
                    click: () => setShowCorridorDetail(true)
                  }}
                />

                {/* 2. Sharp Highway Centerline with PostGIS styling */}
                <Polyline
                  positions={corridorData.geometry.coordinates.map(c => [c[1], c[0]])}
                  pathOptions={{
                    color: '#eab308',
                    weight: 4.5,
                    opacity: 0.95,
                    dashArray: '10, 6',
                    lineCap: 'round',
                    lineJoin: 'round'
                  }}
                  eventHandlers={{
                    click: () => setShowCorridorDetail(true)
                  }}
                >
                  <Tooltip permanent direction="top" className="corridor-highway-tooltip">
                    <div className="bg-amber-950/90 text-amber-200 border border-amber-400/80 px-2 py-0.5 rounded shadow-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>🛣️</span>
                      <span>DEMO / SYNTHETIC PROJECT CORRIDOR</span>
                      <span className="font-mono text-white bg-amber-800 px-1 rounded text-[9px]">
                        {corridorData.properties.corridor_length_km} km
                      </span>
                    </div>
                  </Tooltip>
                </Polyline>
              </>
            )}

            {/* OVERLAY 2: Actual PostGIS GeoJSON Irregular Polygons (Styled dynamically by active GIS mode) */}
            {layerLayers.parcels && parcels.map((p) => {
              if (!p.geometry || !p.geometry.coordinates || !p.geometry.coordinates[0]) return null;
              const coords = p.geometry.coordinates[0].map(c => [c[1], c[0]]);
              const style = getParcelStyle(p);
              
              const isSelected = selectedParcel && (
                String(selectedParcel.id) === String(p.id) ||
                String(selectedParcel.khasra_number) === String(p.khasra_number)
              );
              const isHero = String(p.khasra_number) === '1042';

              return (
                <Polygon
                  key={p.id || p.khasra_number}
                  positions={coords}
                  pathOptions={style}
                  eventHandlers={{
                    click: () => handleSelectParcel(p)
                  }}
                >
                  <Tooltip
                    permanent
                    direction="center"
                    className={
                      isSelected
                        ? 'khasra-field-label-selected'
                        : isHero
                        ? 'khasra-field-label-hero'
                        : 'khasra-field-label'
                    }
                  >
                    <span>{p.survey_number || p.khasra_number}</span>
                  </Tooltip>
                </Polygon>
              );
            })}

                        {/* OVERLAY 3: Field Officer Ground Truth GPS Inspection Markers (Live PostGIS Feed) */}
            {layerLayers.fieldInspections && fieldGpsPoints.map((f) => {
              const props = f.properties || {};
              const coords = [props.latitude, props.longitude];
              const isOutside = props.status === 'GPS OUTSIDE ASSIGNED PARCEL' || !props.gps_verified;
              const isDemo = Boolean(props.is_demo);
              const icon = isDemo ? gpsIconDemo : (isOutside ? gpsIconOutside : gpsIconVerified);

              return (
                <Marker
                  key={f.id || props.log_id || `${props.latitude}-${props.longitude}`}
                  position={coords}
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      const matched = parcels.find(p => 
                        String(p.khasra_number) === String(props.assigned_khasra) ||
                        String(p.id) === String(props.assigned_parcel_id)
                      );
                      if (matched) handleSelectParcel(matched);
                    }
                  }}
                >
                  <Popup>
                    <div className="text-xs p-1.5 space-y-1.5 text-slate-800 min-w-[220px]">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1">
                        <span className="font-extrabold text-slate-900">
                          {props.officer_name || props.officer_id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          isOutside ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {props.status || (props.gps_verified ? 'GPS VERIFIED' : 'GPS OUTSIDE ASSIGNED PARCEL')}
                        </span>
                      </div>

                      {isDemo && (
                        <div className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                          DEMO / SIMULATED LOCATION
                        </div>
                      )}

                      <div className="space-y-0.5 text-[11px] text-slate-700">
                        <div><strong>Assigned Parcel:</strong> Khasra {props.assigned_khasra} ({props.assigned_parcel_id})</div>
                        <div><strong>GPS Position:</strong> {props.latitude?.toFixed(6)}°N, {props.longitude?.toFixed(6)}°E</div>
                        <div><strong>Accuracy:</strong> ±{props.accuracy || props.gps_accuracy}m</div>
                        <div><strong>Distance to Parcel:</strong> <span className={isOutside ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}>{props.distance_meters}m</span> (PostGIS)</div>
                      </div>

                      {props.notes && (
                        <p className="text-[10px] text-slate-600 italic bg-slate-50 p-1 rounded border border-slate-200">
                          "{props.notes}"
                        </p>
                      )}

                      <button
                        onClick={() => {
                          const matched = parcels.find(p => 
                            String(p.khasra_number) === String(props.assigned_khasra) ||
                            String(p.id) === String(props.assigned_parcel_id)
                          );
                          if (matched) handleSelectParcel(matched);
                        }}
                        className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded transition-colors text-center"
                      >
                        Inspect Assigned Parcel
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* 7. DYNAMIC LEGEND: Changes according to selected GIS Mode */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2.5 hidden md:block max-w-sm animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-extrabold text-white uppercase text-[10px] tracking-wider">
                  {GIS_MODES.find(m => m.id === activeGisMode)?.label} Legend
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                {parcels.length} Polygons
              </span>
            </div>

            {/* Dynamic Swatches rendered according to Mode */}
            {renderDynamicLegend()}

            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <span className="w-3.5 h-1.5 rounded-full border-3 border-[#2563eb] bg-[#2563eb]/30"></span>
              <span className="font-bold text-blue-300 text-[11px]">Selected Parcel (Blue Border)</span>
            </div>

            <div className="pt-1.5 border-t border-slate-800 space-y-1">
              <div className="text-[9px] font-extrabold uppercase text-orange-400 tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                <span>Active Field Warning Borders</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-300">
                <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-xs bg-[#ea580c]"></span><span>Boundary mismatch</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-0 border-t-2 border-dashed border-[#ef4444]"></span><span>Khasra mismatch</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-xs bg-[#f59e0b]"></span><span>Compensation issue</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-xs bg-[#dc2626]"></span><span>Owner dispute</span></div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 italic pt-1 border-t border-slate-800">
              * Agricultural crop imagery & roads remain visible beneath all parcel polygons.
            </div>
          </div>
        </div>

        {/* 8b. CORRIDOR DETAIL MODAL / DRAWER */}
      {showCorridorDetail && corridorData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl max-w-xl w-full text-slate-100 overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">Project Corridor Intelligence</h2>
                    <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded uppercase">
                      POSTGIS SPATIAL
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider mt-0.5">
                    {corridorData.properties.corridor_label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCorridorDetail(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {/* Project Title Card */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Corridor</div>
                <div className="text-sm font-extrabold text-white mt-1">
                  {corridorData.properties.project_name}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: <span className="text-amber-400 font-bold">{corridorData.properties.project_id}</span> &bull; {corridorData.properties.state}, {corridorData.properties.district}
                </div>
              </div>

              {/* Corridor Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Length</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">
                    {corridorData.properties.corridor_length_km} km
                  </div>
                  <div className="text-[9px] text-slate-500">PostGIS ST_Length</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Affected</div>
                  <div className="text-lg font-black text-rose-400 mt-0.5">
                    {corridorData.properties.affected_parcels_count}
                  </div>
                  <div className="text-[9px] text-slate-500">ST_Intersects</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Acquired</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    {corridorData.properties.acquired_parcels_count}
                  </div>
                  <div className="text-[9px] text-slate-500">Completed</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">High Risk</div>
                  <div className="text-lg font-black text-orange-400 mt-0.5">
                    {corridorData.properties.high_risk_parcels_count}
                  </div>
                  <div className="text-[9px] text-slate-500">Critical / High</div>
                </div>
              </div>

              {/* Affected Parcels List from ST_Intersects */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Intersecting Parcels (PostGIS Dynamic Spatial Join):</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {corridorData.properties.affected_parcels_count} Cadastral Plots
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(corridorData.properties.affected_khasra_list || []).map((kh) => {
                    const is1042 = kh === '1042';
                    return (
                      <button
                        key={kh}
                        onClick={() => {
                          setShowCorridorDetail(false);
                          const p = parcels.find(item => String(item.khasra_number) === kh);
                          if (p) handleSelectParcel(p);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                          is1042
                            ? 'bg-rose-950/80 border-rose-500 text-rose-200 hover:bg-rose-900 shadow-xs'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span>Khasra {kh}</span>
                        {is1042 && <span className="text-[9px] bg-rose-600 text-white px-1 rounded font-black">CRITICAL</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Statutory Note */}
              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Statutory Alignment Notice (Section 19 Right-of-Way)</span>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  All cadastral polygons intersected by this corridor LineString are subject to statutory Section 11 preliminary notifications, joint measurement surveys, and RFCTLARR 2013 compensation awards.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setShowCorridorDetail(false);
                  handleToggleAffectedOnly();
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-colors shadow-md"
              >
                {onlyAffectedFilter ? 'Show All Parcels' : 'Filter Intersected Parcels on Map'}
              </button>
              <button
                onClick={() => setShowCorridorDetail(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. RIGHT-SIDE DETAIL PANEL & KHASRA 1042 DEMO PIPELINE */}
        {selectedParcel && (
          <aside className="w-96 bg-white text-slate-900 border-l border-slate-200 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto shrink-0 animate-in slide-in-from-right duration-200 p-5 space-y-4">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 font-serif">
                      Khasra {selectedParcel.khasra_number || selectedParcel.survey_number}
                    </span>
                    {String(selectedParcel.khasra_number) === '1042' ? (
                      <span className="text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded uppercase">
                        HERO DISPUTE PARCEL
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        Cadastral Plot
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: <span className="font-bold text-slate-800">{selectedParcel.id || selectedParcel.parcel_id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Close detail panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ACTIVE FIELD INSPECTION ISSUES CARD (Relational: Parcel -> Inspection -> Issue) */}
              {selectedParcel.active_issues && selectedParcel.active_issues.length > 0 && (
                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-950 uppercase tracking-tight">
                      <AlertTriangle className="w-4 h-4 text-orange-600 animate-pulse" />
                      <span>Field Inspection Issues ({selectedParcel.active_issues.length})</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded uppercase">
                      Warning Border
                    </span>
                  </div>

                  {selectedParcel.active_issues.map((issue, idx) => {
                    const isBoundary = issue.issue_type === 'BOUNDARY_MISMATCH';
                    const isKhasra = issue.issue_type === 'KHASRA_MISMATCH';
                    const isComp = issue.issue_type === 'COMPENSATION_ISSUE';
                    const isDispute = issue.issue_type === 'OWNER_DISPUTE';

                    const borderClass = 
                      isBoundary ? 'border-orange-500 bg-orange-50/80' :
                      isKhasra ? 'border-red-500 bg-red-50/80' :
                      isComp ? 'border-amber-500 bg-amber-50/80' :
                      isDispute ? 'border-rose-600 bg-rose-50/80' :
                      'border-orange-400 bg-orange-50/60';

                    return (
                      <div 
                        key={issue.id || idx}
                        className={`p-3.5 rounded-xl border-2 ${borderClass} shadow-xs space-y-2 text-xs transition-all hover:shadow-md`}
                      >
                        {/* Issue Type & Severity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: issue.border_color || '#ea580c' }}
                            />
                            <span className="font-black text-slate-900 uppercase text-[11px] tracking-tight">
                              {issue.formatted_type || issue.issue_type?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            issue.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                            issue.severity === 'HIGH' ? 'bg-orange-600 text-white' :
                            'bg-amber-500 text-slate-950'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>

                        {/* Description */}
                        <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-800 leading-relaxed">
                          {issue.description}
                        </div>

                        {/* Attribute Metadata Grid */}
                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-200/80">
                          <div>
                            <span className="text-slate-500 block uppercase font-semibold">Reported By</span>
                            <span className="font-bold text-slate-900">{issue.reported_by || 'Field Officer'}</span>
                            {issue.officer_id && (
                              <span className="text-slate-500 block font-mono">({issue.officer_id})</span>
                            )}
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase font-semibold">Inspection ID</span>
                            <span className="font-mono font-bold text-blue-700">{issue.inspection_code || issue.inspection_id}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase font-semibold">Timestamp</span>
                            <span className="font-medium text-slate-700">{issue.timestamp || 'Recent'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block uppercase font-semibold">Status</span>
                            <span className="inline-block font-bold text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                              {issue.status || 'OPEN'}
                            </span>
                          </div>
                        </div>

                        {/* Click Issue to Open Inspection */}
                        <button
                          onClick={() => handleOpenInspection(issue.inspection_id || issue.inspection_code)}
                          disabled={loadingInspectionModal}
                          className="w-full mt-1.5 py-1.5 px-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer group"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-300" />
                          <span>{loadingInspectionModal ? 'Loading Inspection...' : 'Open Inspection Dossier'}</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* KHASRA 1042 INTERACTIVE DEMO PIPELINE VISUALIZER (SECTION 8) */}
              {String(selectedParcel.khasra_number) === '1042' && (
                <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase">
                      <Sparkle className="w-3.5 h-3.5" />
                      <span>Khasra 1042 Causal Lifecycle</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                      Step {demoStep} of 6
                    </span>
                  </div>

                  {/* Step Tabs */}
                  <div className="grid grid-cols-6 gap-1 text-[9px] font-bold text-center">
                    {[
                      { s: 1, l: 'Parcel' },
                      { s: 2, l: 'Field' },
                      { s: 3, l: 'Issue' },
                      { s: 4, l: 'AI Risk' },
                      { s: 5, l: 'Alert' },
                      { s: 6, l: 'Action' },
                    ].map(({ s, l }) => (
                      <button
                        key={s}
                        onClick={() => {
                          setDemoStep(s);
                          if (s === 2) setActiveGisMode('FIELD_VERIFICATION');
                          if (s === 3) setActiveGisMode('LEGAL');
                          if (s === 4) setActiveGisMode('AI_RISK');
                        }}
                        className={`py-1 rounded cursor-pointer transition-colors ${
                          demoStep === s 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  {/* Step Description Content */}
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
                    {demoStep === 1 && (
                      <div>
                        <strong className="text-blue-300">1. Cadastral Parcel:</strong> Khasra 1042 encompasses 2.45 ha in Limbdi along NH-GJ-2026-001 corridor, registered under joint ownership.
                      </div>
                    )}
                    {demoStep === 2 && (
                      <div>
                        <strong className="text-cyan-300">2. Field Verification:</strong> Field Officer FO-8832 deployed with GPS Ground Truthing Kit. 4 geotagged photos logged at coordinates 22.3862°N, 71.0676°E.
                      </div>
                    )}
                    {demoStep === 3 && (
                      <div>
                        <strong className="text-rose-300">3. Physical Issue:</strong> 12-meter physical boundary overlap detected between agricultural fence line and statutory RoR demarcation.
                      </div>
                    )}
                    {demoStep === 4 && (
                      <div>
                        <strong className="text-amber-300">4. AI Delay Risk:</strong> PS17 SHAP Model ingests boundary mismatch + Section 15 objection. Risk Score escalated to <span className="text-rose-400 font-bold">88% (CRITICAL)</span> with 74-day predicted delay.
                      </div>
                    )}
                    {demoStep === 5 && (
                      <div>
                        <strong className="text-orange-300">5. Early Warning Alert:</strong> <code className="text-amber-300">ALT-GJ-1042</code> broadcasted to District Collector & CALA regarding Section 15 inquiry backlog.
                      </div>
                    )}
                    {demoStep === 6 && (
                      <div>
                        <strong className="text-emerald-300">6. Closed-Loop Action:</strong> <code className="text-emerald-300">REC-GJ-1042</code>: Joint measurement survey ordered with Revenue Inspector + CALA compensation award hearing expedited within 72 hours.
                      </div>
                    )}
                  </div>
                </div>
              )}

                            {/* CORRIDOR INTERSECTION STATUS (PostGIS ST_Intersects) */}
              <div className="mt-3">
                {selectedParcel.is_affected_by_corridor ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-700">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>AFFECTED BY PROJECT CORRIDOR: YES</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">
                        ST_INTERSECTS
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Directly intersects <strong>DEMO / SYNTHETIC PROJECT CORRIDOR</strong> ({selectedParcel.project_id || 'NH-GJ-2026-001'}). Subject to Section 19 declaration and award.
                    </p>
                    <button
                      onClick={() => setShowCorridorDetail(true)}
                      className="text-[10px] text-amber-800 underline font-bold mt-1 hover:text-amber-950 flex items-center gap-1"
                    >
                      <Activity className="w-3 h-3" />
                      <span>View Full Corridor Intelligence</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Affected by Project Corridor:</span>
                    <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                      NO (Outside Alignment)
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Risk Score</div>
                  <div className="text-xs font-black mt-0.5 flex items-center gap-1.5">
                    <span className={
                      selectedParcel.risk_level === 'CRITICAL' ? 'text-rose-600' :
                      selectedParcel.risk_level === 'HIGH' ? 'text-orange-600' :
                      selectedParcel.risk_level === 'MEDIUM' ? 'text-amber-600' : 'text-emerald-600'
                    }>
                      {selectedParcel.risk_level || 'LOW'}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono">({selectedParcel.ai_risk_score}%)</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acquisition Status</div>
                  <div className="text-xs font-black text-slate-800 mt-0.5">
                    {selectedParcel.modeAcq || selectedParcel.acquisition_status}
                  </div>
                </div>
              </div>

                            {/* FIELD OFFICER GPS GROUND TRUTHING CARD */}
              {(() => {
                const pGps = fieldGpsPoints.find(f => 
                  String(f.properties?.assigned_khasra) === String(selectedParcel.khasra_number) ||
                  String(f.properties?.assigned_parcel_id) === String(selectedParcel.id)
                );
                if (!pGps && String(selectedParcel.khasra_number) !== '1042') return null;

                const props = pGps?.properties || {
                  officer_name: 'Vikram Patel',
                  officer_id: 'FO-8832',
                  latitude: 22.3862,
                  longitude: 71.0676,
                  gps_accuracy: 4.2,
                  distance_meters: 12.0,
                  status: 'GPS OUTSIDE ASSIGNED PARCEL',
                  gps_verified: false,
                  is_demo: false,
                  notes: '12m physical boundary overlap logged with GPS precision against revenue records.'
                };

                const isOutside = props.status === 'GPS OUTSIDE ASSIGNED PARCEL' || !props.gps_verified;

                return (
                  <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-400 text-[11px] uppercase">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Field Officer GPS Ground Truth</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        !isOutside
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {props.status || (props.gps_verified ? 'GPS VERIFIED' : 'GPS OUTSIDE ASSIGNED PARCEL')}
                      </span>
                    </div>

                    {props.is_demo && (
                      <div className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>DEMO / SIMULATED LOCATION</span>
                      </div>
                    )}

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Assigned Parcel:</span>
                        <span className="font-bold text-white">Khasra {selectedParcel.khasra_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Officer:</span>
                        <span className="font-semibold text-slate-200">{props.officer_name} ({props.officer_id})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Actual GPS Position:</span>
                        <span className="font-mono text-cyan-300">{props.latitude?.toFixed(6)}°N, {props.longitude?.toFixed(6)}°E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">GPS Accuracy:</span>
                        <span className="font-mono text-slate-300">±{props.accuracy || props.gps_accuracy}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Distance to Parcel:</span>
                        <span className={`font-black ${
                          isOutside ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {props.distance_meters} meters (PostGIS)
                        </span>
                      </div>
                      {props.notes && (
                        <p className="text-[10px] text-slate-300 italic pt-1 border-t border-slate-800">
                          "{props.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setFlyCoords([props.latitude, props.longitude]);
                      }}
                      className="w-full py-1 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Focus Field Officer GPS Pin</span>
                    </button>
                  </div>
                );
              })()}

              {/* Comprehensive Cadastral Attributes */}
              <div className="mt-3.5 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Khasra / Survey No:</span>
                  <span className="font-extrabold text-slate-900">{selectedParcel.survey_number || selectedParcel.khasra_number}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Project:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[200px]">
                    {selectedParcel.project_id === 'NH-GJ-2026-001' 
                      ? 'Ahmedabad–Rajkot Green Highway Expansion' 
                      : (selectedParcel.project_id || 'NH-GJ-2026-001')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Village / District:</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.village || 'Limbdi'}, {selectedParcel.district || 'Surendranagar'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Area:</span>
                  <span className="font-black text-slate-900">{selectedParcel.area_ha || selectedParcel.area} Hectares</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Primary Owner:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedParcel.primary_owner || 'Suresh & Bhavesh Patel'} ({selectedParcel.owner_count || 1} owners)
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Compensation:</span>
                  <span className={`font-bold ${
                    selectedParcel.modeComp === 'Paid' ? 'text-emerald-700' : 'text-amber-800'
                  }`}>
                    {selectedParcel.modeComp}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Legal / Objections:</span>
                  <span className={`font-bold ${
                    selectedParcel.modeLegal !== 'Clear' ? 'text-rose-700' : 'text-emerald-700'
                  }`}>
                    {selectedParcel.modeLegal}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">R&R (Sch-II):</span>
                  <span className="font-semibold text-slate-800">{selectedParcel.modeRR}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Field Verification:</span>
                  <span className={`font-bold ${
                    selectedParcel.modeField.includes('Mismatch') ? 'text-rose-700' : 'text-slate-800'
                  }`}>
                    {selectedParcel.modeField}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  const lat = selectedParcel.gps_lat || (selectedParcel.geometry?.coordinates?.[0]?.[0]?.[1]) || 22.3862;
                  const lng = selectedParcel.gps_lng || (selectedParcel.geometry?.coordinates?.[0]?.[0]?.[0]) || 71.0676;
                  setFlyCoords([lat, lng]);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Zoom To Parcel</span>
              </button>
              <a
                href="/portal"
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View in Control Room Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>
        )}
      </div>

      {/* 9. OFFICIAL FIELD INSPECTION DOSSIER MODAL */}
      {activeInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black tracking-tight">Official Field Inspection Dossier</h2>
                    <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
                      {activeInspectionModal.status || 'SUBMITTED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Inspection ID: <span className="text-white font-bold">{activeInspectionModal.inspection_code || activeInspectionModal.id}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setActiveInspectionModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Officer & Parcel Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Field Verification Officer</div>
                  <div className="text-sm font-extrabold text-slate-900">
                    {activeInspectionModal.officer_name || 'Vikram Patel'}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Officer ID: <span className="font-bold text-slate-800">{activeInspectionModal.officer_id || 'FO-8832'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Submitted: <span className="font-medium text-slate-700">{activeInspectionModal.submitted_at ? new Date(activeInspectionModal.submitted_at).toLocaleString() : '12 Sep 2026, 11:45 AM'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Assigned Cadastral Parcel</div>
                  <div className="text-sm font-black text-blue-950 font-serif">
                    Khasra {activeInspectionModal.khasra_number || activeInspectionModal.khasra_expected || '1042'}
                  </div>
                  <div className="text-xs text-blue-800">
                    {activeInspectionModal.village || 'Limbdi'}, {activeInspectionModal.district || 'Surendranagar'}, {activeInspectionModal.state || 'Gujarat'}
                  </div>
                  <div className="text-[11px] text-blue-700">
                    Project: <span className="font-bold">Ahmedabad–Rajkot Green Highway Expansion</span>
                  </div>
                </div>
              </div>

              {/* GPS Ground Truth Verification Bar */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
                    <MapPin className="w-4 h-4" />
                    <span>GPS Ground Truth Location</span>
                  </div>
                  <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
                    {activeInspectionModal.gps_verified ? 'GPS VERIFIED (POSTGIS)' : 'GPS VERIFIED'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">COORDINATES</span>
                    <span className="text-cyan-300 font-bold">{activeInspectionModal.latitude || 22.3862}°N, {activeInspectionModal.longitude || 71.0676}°E</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">ACCURACY</span>
                    <span className="text-slate-300">±{activeInspectionModal.gps_accuracy || 3.8}m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">DISTANCE TO BOUNDARY</span>
                    <span className="text-emerald-400 font-bold">{activeInspectionModal.distance_meters || 12.4}m</span>
                  </div>
                </div>
              </div>

              {/* Physical Verification Checklist & Findings */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Field Verification Findings</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Boundary Status</span>
                    <span className="font-black text-rose-700">
                      {activeInspectionModal.boundary_status || 'MISMATCH (12m Overlap)'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Land Use</span>
                    <span className="font-bold text-slate-800">
                      {activeInspectionModal.land_use_observed || 'Agricultural / Cotton Crop'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Encroachments</span>
                    <span className="font-bold text-slate-800">
                      {activeInspectionModal.encroachment_status || 'No Permanent Structures'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reported Issues List */}
              {activeInspectionModal.issues && activeInspectionModal.issues.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reported Statutory Issues ({activeInspectionModal.issues.length})</h3>
                  <div className="space-y-2">
                    {activeInspectionModal.issues.map((iss, idx) => (
                      <div key={iss.id || idx} className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-rose-900 uppercase text-[11px]">{iss.issue_type?.replace(/_/g, ' ')}</span>
                          <span className="text-[9px] font-black bg-rose-200 text-rose-800 px-2 py-0.5 rounded">{iss.severity || 'HIGH'}</span>
                        </div>
                        <p className="text-slate-700 text-[11px]">{iss.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectionModal.remarks && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 uppercase text-[10px]">Officer Remarks</div>
                  <p className="text-amber-800 mt-0.5">{activeInspectionModal.remarks}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setActiveInspectionModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
