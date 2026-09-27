from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.gis_service import (
    get_geojson_parcels,
    get_parcel_geometry,
    get_project_corridor,
    get_project_affected_parcels,
    get_field_gps_points
)

router = APIRouter(tags=["GIS"])

@router.get("/map")
def get_map_geojson(
    project_id: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    acquisition_status: Optional[str] = Query(None),
    compensation_status: Optional[str] = Query(None),
    legal_status: Optional[str] = Query(None),
    field_verification_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get GeoJSON FeatureCollection generated from PostGIS spatial geometry column.
    Supports backend-enforced spatial, attribute, and text search filtering.
    """
    return get_geojson_parcels(
        db,
        project_id=project_id,
        state=state,
        district=district,
        risk_level=risk_level,
        acquisition_status=acquisition_status,
        compensation_status=compensation_status,
        legal_status=legal_status,
        field_verification_status=field_verification_status,
        search=search
    )

@router.get("/projects/{project_id}/map")
def get_project_map_geojson(
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON FeatureCollection for a specific project.
    """
    return get_geojson_parcels(db, project_id=project_id)

@router.get("/parcels/{parcel_id}/geometry")
def get_single_parcel_geometry(
    parcel_id: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON geometry for a single parcel.
    """
    return get_parcel_geometry(db, parcel_id=parcel_id)

@router.get("/gis/state/{state}")
def get_state_gis(
    state: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON FeatureCollection filtered by State.
    """
    return get_geojson_parcels(db, state=state)

@router.get("/gis/district/{district}")
def get_district_gis(
    district: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON FeatureCollection filtered by District.
    """
    return get_geojson_parcels(db, district=district)

@router.get("/gis/projects/{project_id}/corridor")
def get_project_corridor_endpoint(
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON Feature for the project corridor geometry (LineString),
    along with calculated length (km), affected parcel statistics, and statutory details.
    """
    return get_project_corridor(db, project_id=project_id)

@router.get("/gis/projects/{project_id}/affected-parcels")
def get_project_affected_parcels_endpoint(
    project_id: str,
    db: Session = Depends(get_db)
):
    """
    Get PostGIS GeoJSON FeatureCollection containing only the parcels that intersect
    the synthetic project corridor via native PostGIS ST_Intersects spatial query.
    """
    return get_project_affected_parcels(db, project_id=project_id)

@router.get("/gis/inspections/gps")
def get_inspections_gps_endpoint(
    project_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get GeoJSON FeatureCollection of all Field Officer GPS inspection points,
    with distance to assigned parcel (calculated in PostGIS), verification status
    (GPS VERIFIED vs GPS OUTSIDE ASSIGNED PARCEL), and demo/simulated flags.
    """
    return get_field_gps_points(db, project_id=project_id)


