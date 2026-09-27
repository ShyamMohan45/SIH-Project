from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, case
from app.db.models.parcel import Parcel
from app.schemas.parcel import ParcelCreate, ParcelUpdate

def get_parcels(
    db: Session,
    project_id: Optional[str] = None,
    search: Optional[str] = None,
    village: Optional[str] = None,
    district: Optional[str] = None,
    skip: int = 0,
    limit: int = 200
) -> List[Parcel]:
    query = db.query(Parcel)
    if project_id and project_id.upper() != "ALL":
        query = query.filter(Parcel.project_id == project_id)
    if village and village.upper() != "ALL":
        query = query.filter(Parcel.village == village)
    if district and district.upper() != "ALL":
        query = query.filter(Parcel.district == district)
    if search:
        s = f"%{search}%"
        query = query.filter(or_(
            Parcel.survey_number.ilike(s),
            Parcel.village.ilike(s),
            Parcel.primary_owner.ilike(s),
            Parcel.district.ilike(s)
        )).order_by(
            case((Parcel.survey_number == search, 0), else_=1),
            Parcel.survey_number
        )
    return query.offset(skip).limit(limit).all()

def get_parcel_by_id(db: Session, parcel_id: str) -> Optional[Parcel]:
    return db.query(Parcel).filter(
        (Parcel.id == parcel_id) | (Parcel.survey_number == parcel_id)
    ).first()
