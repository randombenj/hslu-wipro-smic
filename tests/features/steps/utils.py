import requests
import time


BASE_URL = "http://localhost:8080"

def await_data_request(url) -> requests.Response:
    timeout = time.time() + 60  # seconds
    while True:
        response = requests.get(BASE_URL+url)
        assert response.ok

        if len(response.json()) > 0:
            return response

        if time.time() > timeout:
            raise TimeoutError("Timed out waiting or api to serve the expected data")

def await_data_post(url, data) -> requests.Response:
    timeout = time.time() + 60  # seconds
    while True:
        response = requests.post(BASE_URL+url, json=data)
        assert response.ok

        if len(response.json()) > 0:
            return response

        if time.time() > timeout:
            raise TimeoutError("Timed out waiting or api to respond")