from database import engine
from sqlalchemy import text

def drop_admins():
    with engine.connect() as conn:
        print("Dropping admins table...")
        conn.execute(text("DROP TABLE IF EXISTS admins CASCADE;"))
        conn.commit()
        print("Table dropped.")

if __name__ == "__main__":
    drop_admins()
