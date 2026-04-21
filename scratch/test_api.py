import requests

def test_user_reg():
    url = "http://localhost:8000/api/v1/users/"
    data = {"name": "Test User", "phone": "1112223334", "password": "pass123"}
    resp = requests.post(url, json=data)
    print("User Reg Status:", resp.status_code)
    print("User Reg Response:", resp.json())

def test_driver_reg():
    url = "http://localhost:8000/api/v1/drivers/"
    data = {"name": "Test Driver", "phone": "5556667778", "password": "pass123", "vehicle_no": "KA-01-AB-1234"}
    resp = requests.post(url, json=data)
    print("Driver Reg Status:", resp.status_code)
    print("Driver Reg Response:", resp.json())

if __name__ == "__main__":
    test_user_reg()
    test_driver_reg()
