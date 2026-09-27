// Geo Calculations & Demo Coordinates
export const DEMO_COORDS = {
  // Khasra 1042 centroid
  khasra1042: {
    lat: 22.386221,
    lng: 71.064316,
    khasra: '1042',
    village: 'Limbdi',
    district: 'Surendranagar'
  },
  // Simulated officer location standing 12m away
  officerGps: {
    lat: 22.386315,
    lng: 71.064390,
    accuracy: 8.0,
    distanceMeters: 12.4
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meters for government field display
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters} metres`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}
