from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from app.schemas.admin_schema import AdminResponse, AdminLogin
from app.schemas.user_schems import UserResponse, UserCreate
from app.schemas.driver_schema import DriverResponse, DriverCreate
import app.routers.admin_router as admin_crud
import app.routers.user_router as user_crud
import app.routers.driver_router as driver_crud
import uuid

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return user_crud.get_users(db)

@router.post("/login", response_model=AdminResponse)
def login_admin(login: AdminLogin, db: Session = Depends(get_db)):
    admin = admin_crud.authenticate_admin(db, login.email, login.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return admin

@router.delete("/users/{user_id}")
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    result = user_crud.delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result

@router.get("/drivers", response_model=list[DriverResponse])
def list_drivers(db: Session = Depends(get_db)):
    return driver_crud.get_drivers(db)

@router.delete("/drivers/{driver_id}")
def delete_driver(driver_id: uuid.UUID, db: Session = Depends(get_db)):
    result = driver_crud.delete_driver(db, driver_id)
    if not result:
        raise HTTPException(status_code=404, detail="Driver not found")
    return result

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: uuid.UUID, user: UserCreate, db: Session = Depends(get_db)):
    updated_user = user_crud.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.put("/drivers/{driver_id}", response_model=DriverResponse)
def update_driver(driver_id: uuid.UUID, driver: DriverCreate, db: Session = Depends(get_db)):
    updated_driver = driver_crud.update_driver(db, driver_id, driver)
    if not updated_driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return updated_driver