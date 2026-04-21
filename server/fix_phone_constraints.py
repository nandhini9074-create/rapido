from sqlalchemy import text
from database import engine

def fix_phone_numbers():
    with engine.connect() as conn:
        print("Cleaning up existing phone numbers...")
        
        # Fix users table
        conn.execute(text("UPDATE users SET phone = LPAD(phone, 10, '0') WHERE length(phone) <> 10;"))
        print("Fixed phone numbers in users table.")
        
        # Fix drivers table
        conn.execute(text("UPDATE drivers SET phone = LPAD(phone, 10, '0') WHERE length(phone) <> 10;"))
        print("Fixed phone numbers in drivers table.")
        
        # Add constraints
        print("Adding length constraints...")
        try:
            conn.execute(text("ALTER TABLE users ADD CONSTRAINT phone_len_check CHECK (length(phone) = 10);"))
            print("Added constraint to users table.")
        except Exception as e:
            print(f"Constraint on users might already exist or error: {e}")
            
        try:
            conn.execute(text("ALTER TABLE drivers ADD CONSTRAINT phone_len_check CHECK (length(phone) = 10);"))
            print("Added constraint to drivers table.")
        except Exception as e:
            print(f"Constraint on drivers might already exist or error: {e}")

        conn.commit()
        print("Database update complete.")

if __name__ == "__main__":
    fix_phone_numbers()
