import requests

def test_admin_login():
    url = "http://localhost:8000/api/v1/admin/login"
    payload = {
        "email": "nan@gmail.com",
        "password": "12345"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_admin_login()
