import json
from utils import await_data_post, await_data_request
from behave import given, when, then, step


@given('api with basic set of data')
def step_prepare_api(context):
    await_data_post("/db/setDefaults", None)


@when("assigning a label")
def step_assign_label(context):
    await_data_post("/meters/2/labels",
                    {'label_id': 2, "start_time": "2021-10-29T09:40:05.000Z", "end_time": "2021-10-29T09:40:15.000Z"})


@then("label was assigned correctly")
def step_check_label_assigned_correctly(context):
    response = await_data_request("/labels/assignments")
    assert len(response.json()) == 1
