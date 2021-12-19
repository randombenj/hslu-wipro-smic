import json
import pytest
import socket
import subprocess

from pathlib import Path

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


@scenario("../publish_messages.feature", "Use TLS to secure connection")
def test_tls_encryption():
    pass


@given("the mqtt endpoint is running")
def mqtt_endpoint():
    outcome = socket.socket(
        socket.AF_INET, socket.SOCK_STREAM
    ).connect_ex(("localhost", 8883))

    assert outcome == 0


@pytest.fixture
@when("we check for tls encryption")
def tls_encryption():
    outcome = subprocess.run(
        ["openssl", "s_client", "-connect", "localhost:8883", "-showcerts"],
        capture_output=True
    )

    assert outcome.returncode == 0

    return outcome.stdout.decode("utf-8")


@then("the correct certificate is used")
def correct_certificate_is_used(tls_encryption):
    root_ca = Path(__file__).parent / ".." / ".." / ".." / "data" / "mkcert" / "rootCA.pem"
    assert root_ca.exists()
    assert root_ca.read_text() in tls_encryption