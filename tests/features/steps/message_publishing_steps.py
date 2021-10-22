import json
import requests

from behave import given, when, then, step

from fakemeter import SMICCLient


@given("a smart meter client")
def step_impl(context):
    context.client = SMICCLient()


@when("we publish some measuring data")
def step_impl(context):
    context.data = {
        "meter_serial": "1",
        "voltage_phase_1": 0.1,
        "voltage_phase_2": 0.02,
        "voltage_phase_3": 0.43
    }
    result = context.client.send(json.dumps(context.data))
    assert result.status == 0


@then("the data is available via the api")
def step_impl(context):
    response = requests.get("http://localhost:8080/meters/")
    assert response.ok
    assert response.json()[0]["id"] == context.data["meter_serial"]

    response = requests.get(f"http://localhost:8080/meters/{context.data['meter_serial']}/measurement")
    assert response.ok
    assert response.json()[0]["voltage_phase_1"] == context.data["voltage_phase_1"]
    assert response.json()[0]["voltage_phase_2"] == context.data["voltage_phase_2"]
    assert response.json()[0]["voltage_phase_3"] == context.data["voltage_phase_3"]