from sqlalchemy import text
from database import engine

def fix_admin_schema():
    with engine.connect() as conn:
        print("Checking/Adding columns to admins table...")
        
        # Add is_deleted
        try:
            conn.execute(text("ALTER TABLE admins ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;"))
            print("Added is_deleted column.")
        except Exception as e:
            print(f"is_deleted might already exist or error: {e}")
            
        # Add deleted_at
        try:
            conn.execute(text("ALTER TABLE admins ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;"))
            print("Added deleted_at column.")
        except Exception as e:
            print(f"deleted_at might already exist or error: {e}")

        # Add created_at if missing
        try:
            conn.execute(text("ALTER TABLE admins ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();"))
            print("Added created_at column.")
        except Exception as e:
            print(f"created_at might already exist or error: {e}")

        # Add updated_at if missing
        try:
            conn.execute(text("ALTER TABLE admins ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();"))
            print("Added updated_at column.")
        except Exception as e:
            print(f"updated_at might already exist or error: {e}")

        conn.commit()
        print("Schema update complete.")

if __name__ == "__main__":
    fix_admin_schema()
