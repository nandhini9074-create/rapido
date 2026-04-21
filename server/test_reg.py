import requests

def test_registration():
    url = "http://localhost:8000/api/v1/users/"
    payload = {
        "name": "Script Test User",
        "phone": "7776665554",
        "password": "password123"
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_registration()
