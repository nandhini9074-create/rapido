import requests
import json

url = "http://localhost:8001/api/v1/users/"
data = {
    "name": "Final Test",
    "phone": "9555555555",
    "password": "User@123"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
