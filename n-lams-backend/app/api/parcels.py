import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.parcel import Parcel
from app.db.models.inspection import FieldInspection
from app.schemas.parcel import ParcelOut, ParcelCreate, ParcelUpdate
from app.services.parcel_service import get_parcels, get_parcel_by_id
from app.services.gis_service import get_geojson_parcels
from app.services.audit_service import log_action

router = APIRouter(prefix="/parcels", tags=["Parcels"])

@router.get("", response_model=List[ParcelOut])
def list_parcels(
    project_id: Optional[str] = Query(None),
    village: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db)
):
    return get_parcels(db, project_id=project_id, village=village, district=district, search=search, skip=skip, limit=limit)

@router.get("/geojson")
def get_parcels_geojson(
    project_id: Optional[str] = Query("NH-GJ-2026-001"),
    db: Session = Depends(get_db)
):
    return get_geojson_parcels(db, project_id=project_id)

@router.get("/{parcel_id}", response_model=ParcelOut)
def get_parcel(parcel_id: str, db: Session = Depends(get_db)):
    p = get_parcel_by_id(db, parcel_id)
    if not p:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return p

@router.post("", response_model=ParcelOut)
def create_parcel(data: ParcelCreate, db: Session = Depends(get_db)):
    pid = data.id or f"P-{uuid.uuid4().hex[:6].upper()}"
    parcel = Parcel(
        id=pid,
        project_id=data.project_id,
        survey_number=data.survey_number,
        village=data.village,
        district=data.district,
        area=data.area,
        owner_count=data.owner_count,
        primary_owner=data.primary_owner,
        acquisition_status=data.acquisition_status,
        compensation_status=data.compensation_status,
        legal_status=data.legal_status,
        possession_status=data.possession_status,
        geometry=data.geometry
    )
    db.add(parcel)
    db.commit()
    db.refresh(parcel)
    log_action(db, user="SYSTEM", role="ADMIN", action="CREATE_PARCEL", entity="PARCEL", entity_id=parcel.id)
    return parcel

@router.put("/{parcel_id}", response_model=ParcelOut)
def update_parcel(parcel_id: str, data: ParcelUpdate, db: Session = Depends(get_db)):
    parcel = get_parcel_by_id(db, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    for field, val in data.dict(exclude_unset=True).items():
        setattr(parcel, field, val)
    db.commit()
    db.refresh(parcel)
    log_action(db, user="SYSTEM", role="ADMIN", action="UPDATE_PARCEL", entity="PARCEL", entity_id=parcel.id)
    return parcel

@router.get("/{parcel_id}/history")
def get_parcel_history(parcel_id: str, db: Session = Depends(get_db)):
    return {
        "parcel_id": parcel_id,
        "inspections": db.query(FieldInspection).filter(FieldInspection.parcel_id == parcel_id).all()
    }

@router.get("/{parcel_id}/inspections")
def get_parcel_inspections(parcel_id: str, db: Session = Depends(get_db)):
    return db.query(FieldInspection).filter(FieldInspection.parcel_id == parcel_id).all()

@router.get("/{parcel_id}/risk")
def get_parcel_risk(parcel_id: str, db: Session = Depends(get_db)):
    parcel = get_parcel_by_id(db, parcel_id)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return {
        "parcel_id": parcel.id,
        "survey_number": parcel.survey_number,
        "risk_level": parcel.risk_level,
        "field_verification_status": parcel.field_verification_status
    }
