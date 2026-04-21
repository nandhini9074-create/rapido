from database import SessionLocal
from app.models.user import User
from app.models.driver import Driver, BikeDriver, AutoDriver
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # 5 Users
        users_data = [
            {"name": "Amit", "phone": "9876543201", "password": "User@123"},
            {"name": "Priya", "phone": "9876543202", "password": "User@234"},
            {"name": "Rahul", "phone": "9876543203", "password": "User@345"},
            {"name": "Neha", "phone": "9876543204", "password": "User@456"},
            {"name": "Karan", "phone": "9876543205", "password": "User@567"}
        ]
        
        for u in users_data:
            u["password"] = get_password_hash(u["password"])
            db.add(User(**u))

        # 5 Drivers
        drivers_data = [
            {"name": "Ramesh", "phone": "8876543201", "password": "Driver@123", "vehicle_no": "KA-01-A-1111", "vehicle_type": "Bike"},
            {"name": "Suresh", "phone": "8876543202", "password": "Driver@234", "vehicle_no": "KA-02-B-2222", "vehicle_type": "Auto"},
            {"name": "Vijay", "phone": "8876543203", "password": "Driver@345", "vehicle_no": "KA-03-C-3333", "vehicle_type": "Bike"},
            {"name": "Dinesh", "phone": "8876543204", "password": "Driver@456", "vehicle_no": "KA-04-D-4444", "vehicle_type": "Auto"},
            {"name": "Ashok", "phone": "8876543205", "password": "Driver@567", "vehicle_no": "KA-05-E-5555", "vehicle_type": "Bike"}
        ]

        for d in drivers_data:
            d["password"] = get_password_hash(d["password"])
            v_type = d.pop("vehicle_type")
            if v_type == "Bike":
                db.add(BikeDriver(**d))
            else:
                db.add(AutoDriver(**d))

        db.commit()
        print("Successfully seeded 5 users and 5 drivers.")
    except Exception as e:
        print(f"Error seeding db: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
