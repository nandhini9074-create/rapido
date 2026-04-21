from sqlalchemy.orm import Session
from database import engine, SessionLocal
from app.models.user import User
from app.models.driver import Driver

def check_db():
    db = SessionLocal()
    users = db.query(User).all()
    drivers = db.query(Driver).all()
    
    print(f"Users ({len(users)}):")
    for u in users:
        print(f" - {u.name} ({u.phone})")
        
    print(f"\nDrivers ({len(drivers)}):")
    for d in drivers:
        print(f" - {d.name} ({d.phone}) [{d.vehicle_no}]")
    
    db.close()

if __name__ == "__main__":
    check_db()
