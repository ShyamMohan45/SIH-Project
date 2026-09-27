import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

Base = declarative_base()

def get_engine():
    # Try PostgreSQL first
    try:
        pg_engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            connect_args={"connect_timeout": 3}
        )
        with pg_engine.connect() as conn:
            pass
        print(f"[*] Connected to PostgreSQL database at {settings.DATABASE_URL.split('@')[-1]}")
        return pg_engine
    except Exception as e:
        print(f"[!] PostgreSQL connection failed ({e}). Falling back to SQLite: {settings.SQLITE_FALLBACK_URL}")
        sqlite_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
