from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from app.db.database import Base

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id"), index=True, nullable=False)
    parcel_id = Column(String, ForeignKey("parcels.id"), index=True, nullable=True)
    prediction = Column(String, nullable=False)  # DELAYED / ON_TRACK
    risk_probability = Column(Float, default=0.0)
    risk_level = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    model_version = Column(String, default="2.0.0-rf-synthetic")
    feature_snapshot = Column(Text, nullable=True)  # JSON string of input features
    created_at = Column(DateTime, default=datetime.utcnow)
