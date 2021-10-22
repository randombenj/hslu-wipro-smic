import json
import time
import requests

from behave import given, when, then, step

from fakemeter import SMICCLient


def __await_data_request(url) -> requests.Response:
    timeout = time.time() + 60  # seconds
    while True:
        response = requests.get(url)
        assert response.ok

        if len(response.json()) > 0:
            return response

        if time.time() > timeout:
            raise TimeoutError("Timed out waiting or api to serve the expected data")



@given("a smart meter client")
def step_get_client(context):
    context.client = SMICCLient()


@when("we publish some measuring data")
def step_publish_data(context):
    context.data = {
        "meter_serial": "1",
        "voltage_phase_1": 0.1,
        "voltage_phase_2": 0.02,
        "voltage_phase_3": 0.43
    }
    result = context.client.send(json.dumps(context.data))
    assert result.status == 0


@then("the data is available via the api")
def step_data_is_available(context):
    meter_data = __await_data_request("http://localhost:8080/meters").json()[0]
    assert meter_data["serial_number"] == context.data["meter_serial"]

    measurement_data = __await_data_request(f"http://localhost:8080/meters/{meter_data['id']}/measurements").json()[0]
    assert measurement_data["voltage_phase_1"] == context.data["voltage_phase_1"]
    assert measurement_data["voltage_phase_2"] == context.data["voltage_phase_2"]
    assert measurement_data["voltage_phase_3"] == context.data["voltage_phase_3"]