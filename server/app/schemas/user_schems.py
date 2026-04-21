from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=10, pattern=r'^\d{10}$')
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = Field(None, min_length=10, max_length=10, pattern=r'^\d{10}$')
    password: str | None = None

class UserLogin(BaseModel):
    phone: str
    password: str

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}