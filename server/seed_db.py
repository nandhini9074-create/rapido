from database import SessionLocal
from app.models.user import User
from app.models.driver import Driver

def seed_db():
    db = SessionLocal()
    try:
        # 5 Users
        users_data = [
            {"name": "Amit", "phone": "9876543201", "password": "1111"},
            {"name": "Priya", "phone": "9876543202", "password": "2222"},
            {"name": "Rahul", "phone": "9876543203", "password": "3333"},
            {"name": "Neha", "phone": "9876543204", "password": "4444"},
            {"name": "Karan", "phone": "9876543205", "password": "5555"}
        ]
        
        for u in users_data:
            db.add(User(**u))

        # 5 Drivers
        drivers_data = [
            {"name": "Ramesh", "phone": "8876543201", "password": "6666", "vehicle_no": "KA-01-A-1111"},
            {"name": "Suresh", "phone": "8876543202", "password": "7777", "vehicle_no": "KA-02-B-2222"},
            {"name": "Vijay", "phone": "8876543203", "password": "8888", "vehicle_no": "KA-03-C-3333"},
            {"name": "Dinesh", "phone": "8876543204", "password": "9999", "vehicle_no": "KA-04-D-4444"},
            {"name": "Ashok", "phone": "8876543205", "password": "1010", "vehicle_no": "KA-05-E-5555"}
        ]

        for d in drivers_data:
            db.add(Driver(**d))

        db.commit()
        print("Successfully seeded 5 users and 5 drivers.")
    except Exception as e:
        print(f"Error seeding db: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
