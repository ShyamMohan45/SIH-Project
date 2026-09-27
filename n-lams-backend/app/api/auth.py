from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.user import User
from app.schemas.auth import UserLogin, Token, UserOut
from app.core.security import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    identifier = credentials.email or credentials.username
    if not identifier:
        raise HTTPException(status_code=400, detail="Email or username required")

    user = db.query(User).filter(
        (User.email == identifier) | (User.officer_id == identifier) | (User.name == identifier)
    ).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password"
        )

    token_payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
        "officer_id": user.officer_id,
        "state": user.state,
        "district": user.district
    }
    token = create_access_token(token_payload)

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "state": user.state,
        "district": user.district,
        "officer_id": user.officer_id,
        "assigned_project": "NH-GJ-2026-001"
    }

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_data
    }

@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user
