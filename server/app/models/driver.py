import uuid
from sqlalchemy import String, Boolean, TIMESTAMP, func, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from datetime import datetime
from typing import Optional


class Driver(Base):
    __tablename__ = "drivers"
    __table_args__ = (
        CheckConstraint("length(phone) = 10", name="phone_len_check"),
        CheckConstraint("length(password) = 4 AND password ~ '^[0-9]+$'", name="password_format_check"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    vehicle_no: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    is_available:Mapped[bool] = mapped_column(Boolean, default=True)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True
    )