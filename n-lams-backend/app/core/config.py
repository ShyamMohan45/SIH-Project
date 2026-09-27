import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "N-LAMS API"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # PostgreSQL Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:password@127.0.0.1:3000/nlams"
    )
    SQLITE_FALLBACK_URL: str = os.getenv("SQLITE_FALLBACK_URL", "sqlite:///./nlams.db")

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "nlams-national-infrastructure-jwt-secret-key-2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://localhost:3008,http://localhost:3009,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3008,http://127.0.0.1:3009,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]

    # Directories
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "uploads")
    MODEL_DIR: str = os.path.join(BASE_DIR, "ml", "model")

settings = Settings()
