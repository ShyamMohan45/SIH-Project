from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.risk import RiskPredictRequest, RiskPredictResponse
from app.services.risk_service import calculate_and_save_project_risk
from app.ml.prediction import predict_risk

router = APIRouter(prefix="/risk", tags=["AI Delay Risk Engine"])

@router.post("/predict", response_model=RiskPredictResponse)
def predict_project_risk_api(payload: RiskPredictRequest, db: Session = Depends(get_db)):
    if payload.project_id:
        result = calculate_and_save_project_risk(
            db, project_id=payload.project_id, parcel_id=payload.parcel_id,
            field_override_features=payload.dict(exclude_unset=True)
        )
        return result
    else:
        return predict_risk(payload.dict())

@router.get("/projects/{project_id}")
def get_project_risk_details(project_id: str, db: Session = Depends(get_db)):
    return calculate_and_save_project_risk(db, project_id=project_id)

@router.get("/parcels/{parcel_id}/explain")
def explain_parcel_risk(parcel_id: str, db: Session = Depends(get_db)):
    from app.db.models.parcel import Parcel
    p = db.query(Parcel).filter(Parcel.id == parcel_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return calculate_and_save_project_risk(db, project_id=p.project_id, parcel_id=parcel_id)
