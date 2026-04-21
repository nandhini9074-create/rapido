from database import engine, Base, SessionLocal
from app.models.admin import Admin
from sqlalchemy import text
import app.models.admin

def setup_admin():
    # 1. Update schema for admins table
    with engine.connect() as conn:
        print("Dropping admins table...")
        conn.execute(text("DROP TABLE IF EXISTS admins CASCADE;"))
        conn.commit()
    
    print("Re-creating admins table...")
    Admin.__table__.create(engine)
    
    # 2. Insert new admin
    db = SessionLocal()
    try:
        new_admin = Admin(
            name="Nandhini Admin",
            email="nan@gmail.com",
            password="12345"
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print(f"Successfully added admin: {new_admin.name} ({new_admin.email})")
    except Exception as e:
        print(f"Error adding admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_admin()
