from sqlalchemy.orm import Session
from database import engine, SessionLocal
from app.models.user import User
from app.models.driver import Driver
from app.models.admin import Admin

def check_db():
    db = SessionLocal()
    users = db.query(User).all()
    drivers = db.query(Driver).all()
    admins = db.query(Admin).all()
    
    print(f"Users ({len(users)}):")
    for u in users:
        print(f" - {u.name} ({u.phone}) | Password: {u.password}")
        
    print(f"\nDrivers ({len(drivers)}):")
    for d in drivers:
        print(f" - {d.name} ({d.phone}) [{d.vehicle_no}] | Password: {d.password}")

    print(f"\nAdmins ({len(admins)}):")
    for a in admins:
        print(f" - {a.name} ({a.email}) | Password: {a.password}")
    
    db.close()

if __name__ == "__main__":
    check_db()
