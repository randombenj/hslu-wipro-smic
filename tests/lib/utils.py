from pytest_bdd import given


@given("the database is empty")
def the_database_is_empty(await_data_post):
    await_data_post("/db/clear", None)
