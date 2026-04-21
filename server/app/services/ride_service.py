from sqlalchemy.orm import Session
from app.routers import ride_router as ride_crud
from app.routers import driver_router as driver_crud
import uuid

def request_ride(db: Session, ride_data):
    return ride_crud.create_ride(db, ride_data)

def assign_driver(db: Session, ride_id: uuid.UUID, driver_id: uuid.UUID):
    ride = ride_crud.get_ride(db, ride_id)

    if not ride or ride.status != "requested":
        return None

    driver = driver_crud.get_driver(db, driver_id)
    if not driver:
        return None

    ride.driver_id = driver.id
    ride.status = "assigned"
    driver.is_available = False

    db.commit()
    db.refresh(ride)
    return ride

def complete_ride(db: Session, ride_id: uuid.UUID):
    ride = ride_crud.get_ride(db, ride_id)

    if not ride or ride.status != "assigned":
        return None

    ride.status = "completed"

    if ride.driver_id:
        driver = driver_crud.get_driver(db, ride.driver_id)
        if driver:
            driver.is_available = True

    db.commit()
    db.refresh(ride)
    return ride

def cancel_ride(db: Session, ride_id: uuid.UUID):
    ride = ride_crud.get_ride(db, ride_id)

    if not ride:
        return None

    if ride.driver_id:
        driver = driver_crud.get_driver(db, ride.driver_id)
        if driver:
            driver.is_available = True

    ride.status = "cancelled"
    db.commit()
    db.refresh(ride)
    return ride