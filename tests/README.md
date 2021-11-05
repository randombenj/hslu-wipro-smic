# SMIC - End 2 End testing 🧪

The end to end tests of SMIC are written in BDD.

Before running the tests you need to spin up the test
environment (in the root of the project):

```sh
# spin up the instance
make docker
make run

# setup the python environment
poetry install
poetry run pytest --gherkin-terminal-reporter -vvv
```

