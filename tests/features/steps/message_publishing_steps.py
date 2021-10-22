import json
import requests

from behave import given, when, then, step

from fakemeter import SMICCLient


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
    response = requests.get("http://localhost:8080/meters")
    assert response.ok
    meter_data = response.json()[0]
    assert meter_data["serial_number"] == context.data["meter_serial"]

    response = requests.get(f"http://localhost:8080/meters/{meter_data['id']}/measurements")
    assert response.ok
    measurement_data = response.json()[0]
    assert measurement_data["voltage_phase_1"] == context.data["voltage_phase_1"]
    assert measurement_data["voltage_phase_2"] == context.data["voltage_phase_2"]
    assert measurement_data["voltage_phase_3"] == context.data["voltage_phase_3"]