from pydantic import BaseModel
from datetime import datetime
import uuid

class AdminCreate(BaseModel):
    name: str
    email: str
    password: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    phone: str = ""
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}
