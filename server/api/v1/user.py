from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from app.schemas.user_schems import UserCreate, UserResponse, UserLogin
import app.routers.user_router as user_crud
import uuid

router = APIRouter(prefix="/users", tags=["Users"])


from sqlalchemy.exc import IntegrityError

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return user_crud.create_user(db, user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="User with this phone number already exists"
        )


@router.post("/login", response_model=UserResponse)
def login_user(login: UserLogin, db: Session = Depends(get_db)):
    user = user_crud.authenticate_user(db, login.phone, login.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid phone number or password")
    return user


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return user_crud.get_users(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = user_crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: uuid.UUID, user: UserCreate, db: Session = Depends(get_db)):
    updated_user = user_crud.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}")
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    result = user_crud.delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result