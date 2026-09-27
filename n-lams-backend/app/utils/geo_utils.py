import math
import json
from typing import Dict, Any, Tuple, Optional
from shapely.geometry import shape, Point, Polygon

def parse_geometry(geom_data: Any) -> Optional[Any]:
    if not geom_data:
        return None
    try:
        if isinstance(geom_data, str):
            geom_dict = json.loads(geom_data)
        else:
            geom_dict = geom_data
        return shape(geom_dict)
    except Exception:
        return None

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return round(R * c, 2)

def verify_point_in_or_near_polygon(
    lat: float, lon: float, polygon_geojson: Any, max_distance_meters: float = 150.0
) -> Tuple[bool, float]:
    geom = parse_geometry(polygon_geojson)
    if not geom:
        return (True, 0.0)  # Default fallback if geometry missing

    pt = Point(lon, lat)
    if geom.contains(pt):
        return (True, 0.0)

    # Calculate distance to polygon centroid
    centroid = geom.centroid
    dist = haversine_distance_meters(lat, lon, centroid.y, centroid.x)
    return (dist <= max_distance_meters, dist)
