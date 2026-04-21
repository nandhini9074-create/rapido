from sqlalchemy.orm import Session
import app.models.admin as model
import uuid
from sqlalchemy import func

def find_admin_by_email(db: Session, email: str):
    return db.query(model.Admin).filter(
        model.Admin.email == email,
        model.Admin.deleted_at.is_(None)
    ).first()

def authenticate_admin(db: Session, email: str, password: str):
    admin = find_admin_by_email(db, email)
    if admin and admin.password == password:
        return admin
    return None

def get_admin(db: Session, id: uuid.UUID):
    return db.query(model.Admin).filter(
        model.Admin.id == id,
        model.Admin.deleted_at.is_(None)
    ).first()

def delete_admin(db: Session, id: uuid.UUID):
    db_admin = get_admin(db, id)
    if not db_admin:
        return None
    db_admin.is_deleted = True
    db_admin.deleted_at = func.now()
    db.commit()
    return {"message": "Admin deleted successfully"}
