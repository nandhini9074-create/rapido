from sqlalchemy import text
from database import engine

def run_sql(sql):
    with engine.connect() as conn:
        try:
            conn.execute(text(sql))
            conn.commit()
            return True
        except Exception as e:
            print(f"Error running {sql}: {e}")
            return False

def fix_admin_schema():
    print("Checking/Adding columns to admins table...")
    
    if run_sql("ALTER TABLE admins ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;"):
        print("Added is_deleted column.")
        
    if run_sql("ALTER TABLE admins ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;"):
        print("Added deleted_at column.")

    if run_sql("ALTER TABLE admins ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();"):
        print("Added created_at column.")

    if run_sql("ALTER TABLE admins ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();"):
        print("Added updated_at column.")

    print("Schema update complete.")

if __name__ == "__main__":
    fix_admin_schema()
