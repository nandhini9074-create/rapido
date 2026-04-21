from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import uuid

class DriverCreate(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=10, pattern=r'^\d{10}$')
    password: str
    vehicle_no: str
    vehicle_type: str = Field(..., pattern=r'^(Bike|Auto)$')

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        import re
        pattern = r'^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#\$%&!])[^\s]{6,}$'
        if not re.search(pattern, v):
            raise ValueError("Password must be at least 6 characters long and a combination of alphabets, numbers and symbols.")
        return v

class DriverLogin(BaseModel):
    phone: str
    password: str

class DriverResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    vehicle_no: str
    is_available: bool
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}