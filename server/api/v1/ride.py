from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db
from app.schemas.ride_schema import RideCreate, RideResponse
import app.routers.ride_router as ride_crud
from app.services import ride_service
import uuid

router = APIRouter(prefix="/rides", tags=["Rides"])

@router.post("/", response_model=RideResponse)
def request_ride(ride: RideCreate, db: Session = Depends(get_db)):
    return ride_service.request_ride(db, ride)

@router.get("/", response_model=list[RideResponse])
def get_rides(db: Session = Depends(get_db)):
    return ride_crud.get_rides(db)

@router.get("/{ride_id}", response_model=RideResponse)
def get_ride(ride_id: uuid.UUID, db: Session = Depends(get_db)):
    
    ride = ride_crud.get_ride(db, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride

@router.post("/{ride_id}/assign", response_model=RideResponse)
def assign_driver(ride_id: uuid.UUID, driver_id: uuid.UUID, db: Session = Depends(get_db)):
    result = ride_service.assign_driver(db, ride_id, driver_id)
    if not result:
        raise HTTPException(status_code=400, detail="Assignment failed: Ride not found, already assigned, or driver not found")
    return result

@router.post("/{ride_id}/complete", response_model=RideResponse)
def complete_ride(ride_id: uuid.UUID, db: Session = Depends(get_db)):
    result = ride_service.complete_ride(db, ride_id)
    if not result:
        raise HTTPException(status_code=400, detail="Cannot complete ride: Ride not found or not in 'assigned' status")
    return result

@router.post("/{ride_id}/cancel", response_model=RideResponse)
def cancel_ride(ride_id: uuid.UUID, db: Session = Depends(get_db)):
    result = ride_service.cancel_ride(db, ride_id)
    if not result:
        raise HTTPException(status_code=404, detail="Ride not found")
    return result

@router.put("/{ride_id}", response_model=RideResponse)
def update_ride(ride_id: uuid.UUID, ride: RideCreate, db: Session = Depends(get_db)):
    updated_ride = ride_crud.update_ride(db, ride_id, ride)
    if not updated_ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return updated_ride

@router.delete("/{ride_id}")
def delete_ride(ride_id: uuid.UUID, db: Session = Depends(get_db)):
    result = ride_crud.delete_ride(db, ride_id)
    if not result:
        raise HTTPException(status_code=404, detail="Ride not found")
    return {"message": "Ride deleted successfully"}