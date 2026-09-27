import os
import sys
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text

# Ensure project base is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.config import settings
from app.db.database import engine, Base, get_db

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
## National Land Acquisition & Management System (N-LAMS) API
### Unified SIH PS16 & PS17 Platform
- **Institutional Governance**: Multi-tiered Role-Based Access Control (Central Admin, State, District, Field Officer).
- **PostGIS / GIS Integration**: Irregular Cadastral GeoJSON Boundaries and Point-in-Polygon field verification.
- **Explainable AI**: Random Forest Delay Risk Engine with SHAP Feature Attribution.
- **Closed-Loop Field Verification**: Mobile Inspection submissions directly trigger real-time AI risk recalculation, issue flagging, and automated recommendations.
""",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev frontends on ports 3000, 3008, 3009, 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health check
@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    db_status = "ok"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {e}"

    return {
        "status": "ok",
        "service": "N-LAMS Core API",
        "version": settings.VERSION,
        "database": db_status,
        "environment": settings.ENVIRONMENT
    }

# Include API Routers
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.projects import router as projects_router
from app.api.parcels import router as parcels_router
from app.api.gis import router as gis_router
from app.api.field import router as field_router
from app.api.risk import router as risk_router
from app.api.alerts import router as alerts_router
from app.api.recommendations import router as recommendations_router
from app.api.workflow import router as workflow_router
from app.api.compensation import router as compensation_router
from app.api.legal import router as legal_router
from app.api.rr import router as rr_router
from app.api.audit import router as audit_router
from app.api.reports import router as reports_router
from app.api.public import router as public_router
from app.api.admin_central import router as admin_central_router
from app.api.admin_state import router as admin_state_router

app.include_router(auth_router, prefix="/api")
app.include_router(public_router, prefix="/api")
app.include_router(admin_central_router, prefix="/api")
app.include_router(admin_state_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(parcels_router, prefix="/api")
app.include_router(gis_router, prefix="/api")
app.include_router(field_router, prefix="/api")
app.include_router(risk_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(recommendations_router, prefix="/api")
app.include_router(workflow_router, prefix="/api")
app.include_router(compensation_router, prefix="/api")
app.include_router(legal_router, prefix="/api")
app.include_router(rr_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
