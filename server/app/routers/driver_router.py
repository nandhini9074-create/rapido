from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
import uuid
import app.models.driver as model
import app.models.user as user_model
from app.schemas.driver_schema import DriverCreate
from app.core.security import get_password_hash, verify_password

def get_available_driver(db: Session):
    return db.query(model.Driver).filter(
        model.Driver.is_available == True,
        model.Driver.deleted_at.is_(None)
    ).first()

def create_driver(db: Session, driver: DriverCreate):
    # Check if user already exists
    db_user = db.query(user_model.User).filter(user_model.User.phone == driver.phone).first()
    if not db_user:
        db_user = user_model.User(
            name=driver.name,
            phone=driver.phone,
            password=get_password_hash(driver.password)
        )
        db.add(db_user)

    if driver.vehicle_type == "Bike":
        db_driver = model.BikeDriver(
            name=driver.name,
            phone=driver.phone,
            password=get_password_hash(driver.password),
            vehicle_no=driver.vehicle_no
        )
    else:
        db_driver = model.AutoDriver(
            name=driver.name,
            phone=driver.phone,
            password=get_password_hash(driver.password),
            vehicle_no=driver.vehicle_no
        )

    db.add(db_driver)
    try:
        db.commit()
        db.refresh(db_driver)
        return db_driver
    except IntegrityError:
        db.rollback()
        raise

def get_drivers(db: Session):
    return db.query(model.Driver).filter(
        model.Driver.deleted_at.is_(None)
    ).all()

def get_driver(db: Session, id: uuid.UUID):
    return db.query(model.Driver).filter(
        model.Driver.id == id,
        model.Driver.deleted_at.is_(None)
    ).first()

def find_driver_by_phone(db: Session, phone: str):
    return db.query(model.Driver).filter(
        model.Driver.phone == phone,
        model.Driver.deleted_at.is_(None)
    ).first()

def authenticate_driver(db: Session, phone: str, password: str):
    driver = find_driver_by_phone(db, phone)
    if driver and verify_password(password, driver.password):
        return driver
    return None

def update_driver(db: Session, id: uuid.UUID, driver: DriverCreate):
    db_driver = db.query(model.Driver).filter(
        model.Driver.id == id,
        model.Driver.deleted_at.is_(None)
    ).first()

    if not db_driver:
        return None

    db_driver.name = driver.name
    db_driver.phone = driver.phone
    db_driver.vehicle_no = driver.vehicle_no
    db_driver.updated_at = func.now()
    db.commit()
    db.refresh(db_driver)

    return db_driver

def delete_driver(db: Session, id: uuid.UUID):
    db_driver = db.query(model.Driver).filter(
        model.Driver.id == id,
        model.Driver.deleted_at.is_(None)
    ).first()

    if not db_driver:
        return None

    db_driver.is_deleted = True
    db_driver.deleted_at = func.now()
    db.commit()
    return {"message": "Driver deleted successfully"}