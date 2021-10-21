FROM python:3.10 AS base

# configure docker container
ENV PYTHONDONTWRITEBYTECODE=1 \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1

# set the application name
ENV APP=dataingress

# =============== BUILDER ===============
FROM base AS builder
# Install the build system
RUN pip install poetry==1.1.11

# Copy the library source code
COPY dataingress/pyproject.toml dataingress/poetry.lock /app/$APP/
COPY datastore /app/datastore

# Install the application
WORKDIR /app/$APP
RUN poetry install --no-root --no-ansi --no-dev


# =============== PRODUCTION ===============
FROM base AS production

# Copy the build artifact
COPY --from=builder /app /app
COPY $APP /app/$APP

WORKDIR /app/$APP
ENTRYPOINT [".venv/bin/python3"]
CMD ["-m", "dataingress"]
