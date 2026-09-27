from typing import Optional, Any, Dict, List
from datetime import datetime
from pydantic import BaseModel

class ParcelBase(BaseModel):
    project_id: str
    survey_number: str
    village: str
    district: str
    state: str = "Gujarat"
    area: float = 0.0
    owner_count: int = 1
    primary_owner: Optional[str] = None
    acquisition_status: str = "PENDING"
    compensation_status: str = "PENDING"
    legal_status: str = "CLEAR"
    possession_status: str = "PENDING"
    field_verification_status: str = "PENDING"
    risk_level: str = "LOW"

class ParcelCreate(ParcelBase):
    id: Optional[str] = None
    geometry: Optional[str] = None

class ParcelUpdate(BaseModel):
    acquisition_status: Optional[str] = None
    compensation_status: Optional[str] = None
    legal_status: Optional[str] = None
    possession_status: Optional[str] = None
    field_verification_status: Optional[str] = None
    risk_level: Optional[str] = None

class ParcelOut(ParcelBase):
    id: str
    geometry: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    properties: Dict[str, Any]
    geometry: Optional[GeoJSONGeometry] = None

class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
