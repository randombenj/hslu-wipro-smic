from pytest_bdd import scenario, given, when, then


@scenario("../assign_label.feature", "Assign a label to a meter and load it afterwards")
def test_label_assignment():
    pass


@given('api with basic set of data')
def prepare_api(await_data_post):
    await_data_post("/db/setDefaults", None)


@when("assigning a label")
def assign_label(await_data_post):
    await_data_post(
        "/meters/2/labels",
        {
            'label_id': 2,
            "start_time": "2021-10-29T09:40:05.000Z",
            "end_time": "2021-10-29T09:40:15.000Z"
        }
    )


@then("label was assigned correctly")
def check_label_assigned_correctly(await_data_request):
    response = await_data_request("/meters/2/labels")
    assert len(response.json()) == 1
