from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from api.deps import get_db
from app.schemas.driver_schema import DriverCreate, DriverResponse, DriverLogin
import app.routers.driver_router as driver_crud
import uuid

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.post("/", response_model=DriverResponse)
def create_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    try:
        return driver_crud.create_driver(db, driver)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Driver phone or vehicle number already exists"
        )

@router.post("/login", response_model=DriverResponse)
def login_driver(login: DriverLogin, db: Session = Depends(get_db)):
    driver = driver_crud.authenticate_driver(db, login.phone, login.password)
    if not driver:
        raise HTTPException(status_code=401, detail="Invalid phone number or password")
    return driver

@router.get("/", response_model=list[DriverResponse])
def get_drivers(db: Session = Depends(get_db)):
    return driver_crud.get_drivers(db)

@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver(driver_id: uuid.UUID, db: Session = Depends(get_db)):
    driver = driver_crud.get_driver(db, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(driver_id: uuid.UUID, driver: DriverCreate, db: Session = Depends(get_db)):
    updated_driver = driver_crud.update_driver(db, driver_id, driver)
    if not updated_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated_driver

@router.delete("/{driver_id}")
def delete_driver(driver_id: uuid.UUID, db: Session = Depends(get_db)):
    result = driver_crud.delete_driver(db, driver_id)
    if not result:
        raise HTTPException(status_code=404, detail="Driver not found")
    return result