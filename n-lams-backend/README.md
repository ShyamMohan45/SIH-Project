# National Land Acquisition & Management System (N-LAMS) - Backend API
### Unified SIH PS16 & PS17 Platform

Enterprise modular backend built with FastAPI, PostgreSQL/PostGIS, SQLAlchemy 2.0, Alembic, Scikit-Learn, and SHAP.

---

## 1. Project Directory Structure
```
n-lams-backend/
    app/
        main.py                     # Application entrypoint & router assembly
        seed.py                     # Demo data seeding script
        core/
            config.py               # Environment configuration & settings
            security.py             # Bcrypt password hashing & PyJWT RBAC
        db/
            database.py             # PostgreSQL / PostGIS / SQLite connection engine
            models/                 # SQLAlchemy 2.0 ORM domain models
                user.py
                project.py
                parcel.py
                workflow.py
                inspection.py
                compensation.py
                rr.py
                legal.py
                document.py
                risk.py
                alert.py
                recommendation.py
                audit.py
            migrations/             # Alembic migration environment
                env.py
                versions/
        schemas/                    # Pydantic V2 request & response schemas
        services/                   # Encapsulated business domain services
            project_service.py
            parcel_service.py
            field_service.py
            gis_service.py
            risk_service.py
            alert_service.py
            recommendation_service.py
            audit_service.py
        ml/                         # AI / ML delay risk prediction & explainability
            train.py                # Synthetic dataset generator & RF training
            prediction.py           # Real-time inference
            explainability.py       # SHAP / Tree importance attribution
            model/
                delay_risk_model.joblib
                preprocessor.joblib
                metadata.json
        utils/
            geo_utils.py            # Shapely cadastral GIS calculations
    tests/                          # Pytest suite & 27-step end-to-end verification
    uploads/                        # Field inspection photo storage
    alembic.ini                     # Migration configuration
    requirements.txt                # Production dependencies
    .env.example                    # Environment variable template
```

---

## 2. Quickstart & Development Commands

### 1. Create Virtual Environment & Install Dependencies
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment
```bash
copy .env.example .env
```

### 3. Run Database Migrations
```bash
python -m alembic upgrade head
```

### 4. Seed Database (Demo Data)
```bash
python -m app.seed
```

### 5. Launch FastAPI Backend
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 3. Interactive API Documentation
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Health Check**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 4. Default Seeded Credentials
| Role | Email / Officer ID | Password | Access Scope |
|------|--------------------|----------|--------------|
| Central Admin | `admin@nlams.gov.in` | `password123` | National access |
| State Officer | `state.gj@nlams.gov.in` | `password123` | State-level projects |
| District Officer | `district.rajkot@nlams.gov.in` | `password123` | District jurisdiction |
| Field Officer | `fo.vikram@nlams.gov.in` (`FO-007`) | `password123` | Assigned tasks & inspections |
| Public Viewer | `viewer@nlams.gov.in` | `password123` | Read-only access |
