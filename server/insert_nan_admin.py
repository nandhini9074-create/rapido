from sqlalchemy.orm import Session
from database import SessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash

def insert_admin():
    db: Session = SessionLocal()
    email = "nan@gmail.com"
    password = "nan@20"
    name = "Nandhini"
    
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.email == email).first()
        if existing_admin:
            print(f"Admin with email {email} already exists. Updating password...")
            existing_admin.password = get_password_hash(password)
            db.commit()
            print("Password updated successfully.")
            return

        new_admin = Admin(
            name=name,
            email=email,
            password=get_password_hash(password)
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
