from sqlalchemy import create_engine, Boolean, TIMESTAMP, func, Column
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy import event
import datetime

DATABASE_URL = "postgresql://postgres:pass123@localhost:5432/riderdb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = func.now()

@event.listens_for(Session, "before_flush")
def before_flush(session, flush_context, instances):
    for obj in session.deleted:
        if isinstance(obj, SoftDeleteMixin):
            # Intercept delete and mark as deleted instead
            session.add(obj) # Re-add to session
            obj.is_deleted = True
            obj.deleted_at = datetime.datetime.now(datetime.timezone.utc)