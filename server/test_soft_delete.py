from sqlalchemy.orm import Session
from database import SessionLocal
from app.models.user import User
import uuid

def test_soft_delete():
    db = SessionLocal()
    
    # 1. Create a test user
    test_id = uuid.uuid4()
    user = User(
        id=test_id,
        name="Delete Me",
        phone="0000000000",
        password="password123"
    )
    db.add(user)
    db.commit()
    print(f"Created user with ID: {test_id}")
    
    # 2. "Delete" the user (soft delete)
    user.is_deleted = True
    db.commit()
    print("Set is_deleted = True and committed.")
    
    # 3. Verify it's still in the DB
    db_user = db.query(User).filter(User.id == test_id).first()
    if db_user:
        print(f"Verified: User still exists in DB. is_deleted: {db_user.is_deleted}")
    else:
        print("Error: User was hard deleted!")
        
    # 4. Clean up (actual hard delete for test purposes, or just leave it)
    # db.delete(db_user)
    # db.commit()
    
    db.close()

if __name__ == "__main__":
    test_soft_delete()
