from sqlalchemy.orm import Session, joinedload
import uuid
from sqlalchemy import func
import app.models.ride as model
from app.schemas.ride_schema import RideCreate

def create_ride(db: Session, ride: RideCreate):
    db_ride = model.Ride(
        user_id=ride.user_id,
        source=ride.source,
        destination=ride.destination
    )
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride

def get_rides(db: Session):
    rides = db.query(model.Ride).options(
        joinedload(model.Ride.user),
        joinedload(model.Ride.driver)
    ).filter(model.Ride.deleted_at.is_(None)).all()
    for ride in rides:
        ride.user_name = ride.user.name if ride.user else "Unknown"
        ride.driver_name = ride.driver.name if ride.driver else None
    return rides

def get_ride(db: Session, id: uuid.UUID):
    return db.query(model.Ride).filter(
        model.Ride.id == id,
        model.Ride.deleted_at.is_(None)
    ).first()

def update_ride(db: Session, id: uuid.UUID, ride_data: RideCreate):
    db_ride = get_ride(db, id)
    if not db_ride:
        return None
    db_ride.source = ride_data.source
    db_ride.destination = ride_data.destination
    db.commit()
    db.refresh(db_ride)
    return db_ride

def delete_ride(db: Session, id: uuid.UUID):
    db_ride = get_ride(db, id)
    if not db_ride:
        return False
    db_ride.is_deleted = True
    db_ride.deleted_at = func.now()
    db.commit()
    return True