import json
import pytest

from pytest_bdd import scenario, given, when, then

from fakemeter import SMICCLient


@scenario("../publish_messages.feature", "Publish some measuring data")
def test_message_publish():
    pass


@pytest.fixture
@given("an electricity meter")
def client():
    return SMICCLient()


@pytest.fixture
@when("we publish some measuring data")
def data(client):
    data = {
        "meter_serial": "1",
        "voltage_phase_1": 0.1,
        "voltage_phase_2": 0.02,
        "voltage_phase_3": 0.43,
        "capture_time": "2020-01-01T00:00:00Z",
    }
    result = client.send(json.dumps(data))
    assert result.status == 0
    return data


@then("the data is available via the api")
def data_is_available(data, await_data_request):
    meter_data = await_data_request("/meters").json()[0]
    assert meter_data["serial_number"] == data["meter_serial"]

    measurement_data = await_data_request(f"/meters/{meter_data['id']}/measurements").json()[0]
    assert measurement_data["voltage_phase_1"] == data["voltage_phase_1"]
    assert measurement_data["voltage_phase_2"] == data["voltage_phase_2"]
    assert measurement_data["voltage_phase_3"] == data["voltage_phase_3"]