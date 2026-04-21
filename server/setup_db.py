from database import engine, Base
import app.models.admin
import app.models.user
import app.models.driver
import app.models.ride

def setup_db():
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    setup_db()
