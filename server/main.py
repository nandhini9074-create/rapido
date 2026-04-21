from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from database import Base

import app.models.user
import app.models.driver
import app.models.ride
import app.models.admin

from api.v1 import user, driver, ride, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ride App Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running"}

app.include_router(user.router, prefix="/api/v1")
app.include_router(driver.router, prefix="/api/v1")
app.include_router(ride.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
