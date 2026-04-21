from sqlalchemy.orm import Session
from database import SessionLocal
from app.models.user import User
import uuid

def insert_test():
    db = SessionLocal()
    try:
        new_user = User(name="Manual Test", phone="9999999999", password="pass")
        db.add(new_user)
        db.commit()
        print("Inserted manual test user")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_test()
