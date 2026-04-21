from sqlalchemy.orm import Session
from database import SessionLocal, engine
from app.models.admin import Admin

def insert_admin():
    db: Session = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.email == "nan@gmail.com").first()
        if existing_admin:
            print(f"Admin with email nan@gmail.com already exists: {existing_admin.name}")
            return

        new_admin = Admin(
            name="Nandhini",
            email="nan@gmail.com",
            password="1234"
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print(f"Successfully added admin: {new_admin.name} (ID: {new_admin.id})")
    except Exception as e:
        print(f"Error adding admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_admin()
