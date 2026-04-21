import requests
import time

BASE_URL = "http://localhost:8000/api/v1"

def repro():
    # 1. Register a driver
    phone = "1234567890"
    password = "password123"
    reg_data = {
        "name": "Repro Driver",
        "phone": phone,
        "password": password,
        "vehicle_no": "REP-RO-1234"
    }
    print(f"Registering driver {phone}...")
    resp = requests.post(f"{BASE_URL}/drivers/", json=reg_data)
    print("Reg Status:", resp.status_code)
    if resp.status_code not in [200, 201, 409]:
        print("Reg Failed:", resp.text)
        return

    # 2. Try to login
    login_data = {
        "phone": phone,
        "password": password
    }
    print(f"Logging in driver {phone}...")
    resp = requests.post(f"{BASE_URL}/drivers/login", json=login_data)
    print("Login Status:", resp.status_code)
    print("Login Response:", resp.json())

if __name__ == "__main__":
    repro()
