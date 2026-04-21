from pydantic import BaseModel
from datetime import datetime
import uuid

class RideCreate(BaseModel):
    user_id: uuid.UUID
    source: str
    destination: str

class RideResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user_name: str | None = None
    driver_id: uuid.UUID | None = None
    driver_name: str | None = None
    source: str
    destination: str
    status: str
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}