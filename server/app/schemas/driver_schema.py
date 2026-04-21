from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class DriverCreate(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=10, pattern=r'^\d{10}$')
    password: str
    vehicle_no: str

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