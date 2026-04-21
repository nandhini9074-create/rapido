import requests
import json

url = "http://localhost:8000/api/v1/rides/"
data = {
    "user_id": "31bcc24a-020a-4355-9f93-15286475c74a",
    "source": "Marina Beach",
    "destination": "T Nagar"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
