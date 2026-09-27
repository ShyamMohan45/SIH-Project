import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers, AlertCircle, CheckCircle2, ChevronUp } from 'lucide-react';
import { api } from '../services/api';
import { DEMO_COORDS } from '../services/geoUtils';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Officer Location Icon (Blue pulsating marker)
const officerIcon = new L.DivIcon({
  className: 'officer-marker',
  html: `<div style="position:relative; width:24px; height:24px;">
    <div style="position:absolute; width:24px; height:24px; background:rgba(29, 78, 216, 0.4); border-radius:50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; background:#1d4ed8; border:3px solid #ffffff; border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 16);
    }
  }, [center, zoom, map]);
  return null;
}

export default function FieldMapPage({ onStartInspection }) {
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, ASSIGNED, HIGH_RISK, COMPLETED
  const [mapCenter, setMapCenter] = useState([22.3863, 71.0643]);
  const [mapZoom, setMapZoom] = useState(16);
  const [officerPos, setOfficerPos] = useState([DEMO_COORDS.officerGps.lat, DEMO_COORDS.officerGps.lng]);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const data = await api.getFieldMap();
        setParcels(data.features || []);
        // Auto-select Khasra 1042 if available
        const p1042 = data.features?.find(f => f.properties?.khasra_number === '1042');
        if (p1042) {
          setSelectedParcel(p1042.properties);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchMap();
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setOfficerPos([lat, lng]);
          setMapCenter([lat, lng]);
          setMapZoom(17);
        },
        () => {
          // Fallback to simulated location
          setMapCenter([DEMO_COORDS.officerGps.lat, DEMO_COORDS.officerGps.lng]);
          setMapZoom(17);
        }
      );
    }
  };

  const handleCenterKhasra1042 = () => {
    setMapCenter([DEMO_COORDS.khasra1042.lat, DEMO_COORDS.khasra1042.lng]);
    setMapZoom(17);
    const p1042 = parcels.find(f => f.properties?.khasra_number === '1042');
    if (p1042) setSelectedParcel(p1042.properties);
  };

  const filteredParcels = parcels.filter(f => {
    const props = f.properties || {};
    if (filter === 'ASSIGNED') return props.is_assigned;
    if (filter === 'HIGH_RISK') return props.risk_level === 'High' || props.risk_level === 'Critical';
    if (filter === 'COMPLETED') return props.field_verified;
    return true;
  });

  return (
    <div className="relative h-[calc(100vh-120px)] w-full flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200 flex gap-1 text-[11px]">
          {['ALL', 'ASSIGNED', 'HIGH_RISK', 'COMPLETED'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilter(ft)}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                filter === ft ? 'bg-gov-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {ft === 'HIGH_RISK' ? 'High Risk' : ft.charAt(0) + ft.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Quick Demo Button */}
        <button
          onClick={handleCenterKhasra1042}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1.5 rounded-xl shadow-md border border-amber-600 active:scale-95"
        >
          Khasra 1042
        </button>
      </div>

      {/* Interactive Leaflet Map Canvas */}
      <div className="flex-1 w-full relative z-10">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ width: '100%', height: '100%' }}>
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Cadastral Parcels */}
          {filteredParcels.map((feature) => {
            const props = feature.properties;
            const is1042 = props.khasra_number === '1042';
            const isSelected = selectedParcel?.parcel_id === props.parcel_id;

            let color = '#3b82f6';
            let fillColor = '#93c5fd';
            if (is1042) {
              color = '#f59e0b';
              fillColor = '#fbbf24';
            } else if (props.risk_level === 'Critical' || props.acquisition_status === 'Disputed') {
              color = '#dc2626';
              fillColor = '#f87171';
            } else if (props.field_verified) {
              color = '#16a34a';
              fillColor = '#86efac';
            }

            const coordinates = feature.geometry?.coordinates?.[0]?.map(c => [c[1], c[0]]) || [];

            return (
              <Polygon
                key={props.parcel_id || Math.random()}
                positions={coordinates}
                pathOptions={{
                  color: isSelected ? '#1d4ed8' : color,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.6 : 0.35,
                  weight: isSelected ? 4 : (is1042 ? 3 : 1.5),
                  dashArray: is1042 ? '4 2' : null
                }}
                eventHandlers={{
                  click: () => {
                    setSelectedParcel(props);
                  }
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <strong className="block font-black text-slate-900">Khasra No. {props.khasra_number}</strong>
                    <div>Village: {props.village}</div>
                    <div>Area: {props.area_ha} ha</div>
                    <div>Status: {props.acquisition_status}</div>
                    <div>Risk: {props.risk_level} ({props.ai_risk_score}%)</div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Field Officer Marker */}
          <Marker position={officerPos} icon={officerIcon}>
            <Popup>
              <div className="text-xs">
                <strong>Officer Location (FO-007)</strong>
                <p className="text-[10px] text-slate-500">Live GPS Verified (±8m)</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Map Floating Tools */}
        <div className="absolute right-3 bottom-36 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={handleLocateMe}
            className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-lg border border-slate-200 flex items-center justify-center active:scale-95"
            title="Locate My Position"
          >
            <Navigation className="w-5 h-5 text-gov-700" />
          </button>
        </div>
      </div>

      {/* Bottom Selected Parcel Sheet */}
      {selectedParcel && (
        <div className="bg-white border-t border-slate-300 p-4 z-20 shadow-2xl rounded-t-2xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gov-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Khasra {selectedParcel.khasra_number}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedParcel.risk_level === 'Critical' || selectedParcel.risk_level === 'High'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Risk: {selectedParcel.risk_level} ({selectedParcel.ai_risk_score}%)
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-1">
                {selectedParcel.village}, {selectedParcel.district}
              </h3>
              <p className="text-xs text-slate-500">
                Area: <strong>{selectedParcel.area_ha} ha</strong> • Owner: {selectedParcel.owner_name}
              </p>
            </div>

            <button
              onClick={() => onStartInspection(`TASK-FO-${selectedParcel.khasra_number}`)}
              className="px-4 py-2.5 bg-gov-800 hover:bg-gov-700 text-white font-bold text-xs rounded-xl shadow active:scale-95 flex items-center gap-1.5"
            >
              <span>Verify Parcel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
