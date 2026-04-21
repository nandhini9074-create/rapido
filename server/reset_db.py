from database import engine, Base
import app.models.user
import app.models.driver
import app.models.ride
import app.models.admin
from sqlalchemy import text

def reset_db():
    with engine.connect() as conn:
        print("Dropping all tables...")
        conn.execute(text("DROP TABLE IF EXISTS users, drivers, rides, admins CASCADE;"))
        conn.commit()
        print("Tables dropped.")
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    reset_db()
