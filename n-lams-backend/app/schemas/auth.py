from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "VIEWER"
    state: Optional[str] = None
    district: Optional[str] = None
    officer_id: Optional[str] = None

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    state: Optional[str] = None
    district: Optional[str] = None
    officer_id: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
