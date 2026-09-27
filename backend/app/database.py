import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Uses SQLITE by default with absolute path to project root, with POSTGRESQL/POSTGIS compatibility via DATABASE_URL
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
default_sqlite_path = os.path.join(root_dir, "nlams.db").replace("\\", "/")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{default_sqlite_path}")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
