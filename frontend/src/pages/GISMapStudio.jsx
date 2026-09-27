import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, Search, Filter, AlertTriangle, CheckCircle2, 
  MapPin, Eye, ExternalLink, RefreshCw, X, ShieldCheck,
  Compass, ArrowRight, Camera, Sparkles, Sliders
} from 'lucide-react';
import { api } from '../services/api';

// Fix Leaflet marker icon asset issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically pan and zoom to target parcel/project
function MapController({ targetCoords, targetZoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, targetZoom, { duration: 1.2 });
    }
  }, [targetCoords, targetZoom, map]);
  return null;
}

export default function GISMapStudio({ onSelectProject, onSelectParcelDetail }) {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchKhasra, setSearchKhasra] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [basemap, setBasemap] = useState('drone_satellite'); // 'drone_satellite' | 'esri_satellite' | 'osm'
  const [overlayOpacity, setOverlayOpacity] = useState(0.92);
  const [flyCoords, setFlyCoords] = useState(null);

  // Center of Ahmedabad - Rajkot Green Highway Expansion corridor (Khasra 1042 / Limbdi cluster)
  const defaultCenter = [22.3862, 71.0676];

  // Precise georeferenced bounding box for high-resolution agricultural drone visual
  const droneImageBounds = [
    [22.3780, 71.0585],
    [22.3920, 71.0805]
  ];

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      try {
        const queryParams = { project_id: 'NH-GJ-2026-001' };
        if (riskFilter !== 'ALL') queryParams.risk_level = riskFilter;
        if (statusFilter !== 'ALL') queryParams.acquisition_status = statusFilter;

        const data = await api.getMap(queryParams);
        const feats = data?.features?.map(f => {
          const props = f.properties || {};
          const khasra = String(props.khasra_number || props.khasra_no || props.survey_number || props.id || '').replace(/^P-/, '').replace(/^Sur-/, '');
          return {
            ...props,
            khasra_number: khasra || '1042',
            khasra_no: khasra || '1042',
            geometry: f.geometry
          };
        }) || [];
        setParcels(feats);
        
        // Auto-select Khasra 1042 as the exemplar demonstration parcel
        if (feats.length > 0) {
          const currentFound = selectedParcel ? feats.find(p => p.khasra_number === selectedParcel.khasra_number) : null;
          if (currentFound) {
            setSelectedParcel(currentFound);
          } else {
            const k1042 = feats.find(p => p.khasra_number === '1042');
            setSelectedParcel(k1042 || feats[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching GIS GeoJSON:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGeoData();
  }, [riskFilter, statusFilter]);

  const handleSearchKhasra = (e) => {
    e.preventDefault();
    if (!searchKhasra.trim()) return;
    const found = parcels.find(p => 
      p.khasra_number?.toLowerCase() === searchKhasra.trim().toLowerCase() ||
      p.id?.toLowerCase() === searchKhasra.trim().toLowerCase()
    );
    if (found) {
      setSelectedParcel(found);
      if (found.gps_lat && found.gps_lng) {
        setFlyCoords([found.gps_lat, found.gps_lng]);
      }
    }
  };

  // Border outline styling based on risk (NEVER blue; uses green, orange, and red exclusively!)
  const getParcelStyle = (p) => {
    const pKhasra = String(p.khasra_number || p.khasra_no || '').trim();
    const selKhasra = String(selectedParcel?.khasra_number || selectedParcel?.khasra_no || '').trim();
    const isSelected = selKhasra && pKhasra && selKhasra === pKhasra;
    const isHero = pKhasra === '1042';

    const risk = (p.risk_level || '').toUpperCase();
    const status = (p.acquisition_status || '').toUpperCase();
    const legal = (p.legal_status || '').toUpperCase();
    const score = Number(p.ai_risk_score || 0);

    // Green, Orange, and Red Border Hierarchy:
    // 1. RED BORDER: Critical Risk, Disputed Legal Status, or Hero Khasra 1042 (High Court dispute & overlap)
    // 2. ORANGE BORDER: High Risk or Under Process / Pending issues
    // 3. GREEN BORDER: Low Risk / Acquired / Clear title

    let borderColor = '#16a34a'; // Emerald Green
    let fillColor = '#22c55e';

    if (risk === 'CRITICAL' || score >= 80 || legal === 'DISPUTED' || legal === 'LITIGATION' || isHero) {
      borderColor = '#dc2626'; // Vivid Red Border
      fillColor = '#ef4444';
    } else if (risk === 'HIGH' || score >= 50 || status === 'UNDER PROCESS') {
      borderColor = '#ea580c'; // Vibrant Orange Border
      fillColor = '#f97316';
    } else if (risk === 'MEDIUM' || score >= 25 || status.includes('PENDING') || status.includes('NOTIFIED')) {
      borderColor = '#f59e0b'; // Amber-Orange Border
      fillColor = '#fbbf24';
    } else {
      borderColor = '#16a34a'; // Clean Green Border
      fillColor = '#22c55e';
    }

    return {
      color: borderColor,
      weight: isSelected ? 4.5 : isHero ? 3.5 : 2.5,
      // Minimal transparent fill so actual green crop fields are completely visible underneath!
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.22 : 0.08,
      dashArray: (legal === 'DISPUTED' || legal === 'LITIGATION') ? '6, 4' : undefined,
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  const filteredParcels = parcels;

  return (
    <div className="relative h-[calc(100vh-80px)] w-full flex overflow-hidden font-sans bg-slate-900">
      {/* 1. TOP FLOATING CONTROL BAR */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-300 shadow-lg flex flex-wrap items-center gap-3 text-xs max-w-5xl">
        <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
          <Layers className="w-4 h-4 text-blue-700" />
          <span className="font-extrabold text-slate-900">Cadastral GIS Studio</span>
          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300 uppercase">
            DEMO GIS DATA
          </span>
        </div>

        {/* Search Khasra input */}
        <form onSubmit={handleSearchKhasra} className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Khasra (e.g. 1042)..."
              value={searchKhasra}
              onChange={(e) => setSearchKhasra(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-500 w-44 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
          >
            Locate
          </button>
        </form>

        {/* Risk Filter */}
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-bold">Risk:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Critical">Critical (Red Border)</option>
            <option value="High">High (Orange Border)</option>
            <option value="Medium">Medium (Yellow Border)</option>
            <option value="Low">Low (Green Border)</option>
          </select>
        </div>

        {/* Basemap Switcher */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <span className="text-slate-500 font-bold">Layer:</span>
          <select
            value={basemap}
            onChange={(e) => setBasemap(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none text-blue-900"
          >
            <option value="drone_satellite">🌾 High-Res Agricultural Drone (Default)</option>
            <option value="esri_satellite">🛰️ Satellite (Esri World Imagery)</option>
            <option value="osm">🗺️ Topographic (OpenStreetMap)</option>
          </select>
        </div>

        {/* Drone Overlay Opacity Slider */}
        {basemap === 'drone_satellite' && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] text-slate-500 font-bold">Opacity:</span>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-200 rounded-lg cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] font-mono font-bold text-slate-700">{Math.round(overlayOpacity * 100)}%</span>
          </div>
        )}

        {/* Focus on Hero Khasra 1042 */}
        <button
          onClick={() => {
            const k1042 = parcels.find(p => p.khasra_number === '1042');
            if (k1042) {
              setSelectedParcel(k1042);
              setFlyCoords([k1042.gps_lat || 22.3862, k1042.gps_lng || 71.0676]);
            }
          }}
          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-bold text-xs flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Focus Khasra 1042</span>
        </button>

        {/* Reset View */}
        <button
          onClick={() => {
            setFlyCoords(defaultCenter);
            const k1042 = parcels.find(p => p.khasra_number === '1042');
            if (k1042) setSelectedParcel(k1042);
          }}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg font-bold"
          title="Reset Camera to Corridor Center"
        >
          Reset View
        </button>
      </div>

      {/* 2. BOTTOM FLOATING LEGEND */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-300 shadow-lg text-xs space-y-2 hidden sm:block max-w-sm">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
            Cadastral Boundary Risk Legend
          </div>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
            EPSG:4326
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full border-2 border-emerald-500 bg-emerald-500/10"></span>
            <span>Low Risk (Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full border-2 border-amber-500 bg-amber-500/10"></span>
            <span>Medium / Pending (Yellow)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full border-2 border-orange-600 bg-orange-600/10"></span>
            <span>High Risk (Orange)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-1.5 rounded-full border-2 border-rose-600 bg-rose-600/10"></span>
            <span>Critical Issue (Red)</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-100">
            <span className="w-4 h-1.5 rounded-full border-3 border-red-600 bg-red-600/20"></span>
            <span className="font-bold text-slate-800">Selected Plot (Enhanced Outline with Risk Color)</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-100">
          * Green crop imagery remains visible inside all parcels (no solid opaque fill).
        </div>
      </div>

      {/* 3. MAIN LEAFLET MAP VIEWPORT */}
      <div className="flex-1 h-full w-full">
        <MapContainer
          center={defaultCenter}
          zoom={16}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {/* Base Layer 1: Satellite / Agricultural Imagery (Esri World Imagery + Reference) */}
          {basemap !== 'osm' && (
            <>
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
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

          {/* Base Layer 2: Street Map (OpenStreetMap Standard) */}
          {basemap === 'osm' && (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          <MapController targetCoords={flyCoords} />

          {/* Render Realistic Irregular Cadastral Polygons with Transparent Interior & Colored Risk Outlines */}
          {filteredParcels.map((p) => {
            if (!p.geometry || !p.geometry.coordinates) return null;
            // Leaflet expects [lat, lng], GeoJSON gives [lng, lat]
            const coords = p.geometry.coordinates[0].map(c => [c[1], c[0]]);
            const style = getParcelStyle(p);
            const isHero = p.khasra_number === '1042';

            return (
              <Polygon
                key={p.id}
                positions={coords}
                pathOptions={style}
                eventHandlers={{
                  click: () => setSelectedParcel(p)
                }}
              >
                {/* Permanent Khasra Number Label centered ON the agricultural field */}
                <Tooltip
                  permanent
                  direction="center"
                  className={isHero ? 'khasra-field-label-hero' : 'khasra-field-label'}
                >
                  <span>{p.khasra_number}</span>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      {/* 4. RIGHT SIDE CONTEXT DRAWER: HERO PARCEL & ATTRIBUTE DOSSIER */}
      {selectedParcel && (
        <div className="w-96 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto shrink-0 p-5 space-y-4 animate-in slide-in-from-right duration-200">
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 font-serif">
                    Khasra {selectedParcel.khasra_number}
                  </span>
                  {selectedParcel.khasra_number === '1042' ? (
                    <span className="text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded uppercase">
                      HERO SIH PARCEL
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      Cadastral Plot
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  ID: <span className="font-mono font-bold text-slate-700">{selectedParcel.id || selectedParcel.parcel_id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Critical Status Badges */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Acquisition Status</div>
                <div className="text-xs font-black text-slate-800 mt-0.5">{selectedParcel.acquisition_status}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase">AI Delay Risk</div>
                <div className="text-xs font-black text-rose-700 mt-0.5 flex items-center gap-1">
                  <span>{selectedParcel.risk_level?.toUpperCase()}</span>
                  <span>({selectedParcel.ai_risk_score}%)</span>
                </div>
              </div>
            </div>

            {/* Geographical & Administrative Details */}
            <div className="mt-4 space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Project:</span>
                <span className="font-bold text-slate-900 text-right">Ahmedabad–Rajkot Green Highway Expansion</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Village / District:</span>
                <span className="font-semibold text-slate-800">{selectedParcel.village || 'Limbdi'}, {selectedParcel.district || 'Surendranagar'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Area:</span>
                <span className="font-black text-slate-900">{selectedParcel.area_ha} Hectares</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Compensation:</span>
                <span className={`font-bold ${selectedParcel.khasra_number === '1042' ? 'text-amber-700' : 'text-slate-900'}`}>
                  {selectedParcel.khasra_number === '1042' ? 'Issue Reported (Rate Disparity)' : selectedParcel.compensation_status}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Legal Title Status:</span>
                <span className={`font-bold ${selectedParcel.legal_status === 'Disputed' ? 'text-rose-700' : 'text-slate-900'}`}>
                  {selectedParcel.legal_status || 'Clear'}
                  {selectedParcel.legal_case_no && selectedParcel.legal_case_no !== 'None' && ` (${selectedParcel.legal_case_no})`}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="font-mono text-slate-700">{selectedParcel.gps_lat || '22.3862'}° N, {selectedParcel.gps_lng || '71.0676'}° E</span>
              </div>
            </div>

            {/* Field Truthing Evidence Section for Khasra 1042 */}
            {selectedParcel.khasra_number === '1042' && (
              <div className="mt-4 p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px] uppercase">
                  <Camera className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ground Field Inspection Dossier</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Field Officer FO-8832 recorded a <strong className="text-rose-700">12m physical boundary overlap</strong> against revenue RoR records. 4 geotagged photos logged with 4.2m GPS precision.
                </p>
                <div className="flex items-center justify-between text-[10px] text-amber-700 font-semibold pt-1 border-t border-amber-200">
                  <span>Inspection ID: FO-1042-2026-001</span>
                  <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">Received</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <button
              onClick={() => onSelectParcelDetail && onSelectParcelDetail(selectedParcel)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Ground Truthing Cell</span>
            </button>
            <button
              onClick={() => onSelectProject && onSelectProject(selectedParcel.project_id || 'NH-GJ-2026-001')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Corridor Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
