from sqlalchemy.orm import Session
from database import engine, SessionLocal
from app.models.user import User
from app.models.driver import Driver

def check_db():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Users ({len(users)}):")
        for u in users:
            print(f" - {u.name} ({u.phone}) | Password: {u.password}")
    except Exception as e:
        print(f"Error checking users: {e}")
        
    try:
        drivers = db.query(Driver).all()
        print(f"\nDrivers ({len(drivers)}):")
        for d in drivers:
            print(f" - {d.name} ({d.phone}) [{d.vehicle_no}] | Password: {d.password}")
    except Exception as e:
        print(f"Error checking drivers: {e}")

    db.close()

if __name__ == "__main__":
    check_db()
