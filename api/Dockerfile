FROM python:3.9 AS base

# configure docker container
ENV PYTHONDONTWRITEBYTECODE=1 \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1

# set the application name
ENV APP=api

# =============== BUILDER ===============
FROM base AS builder
# Install the build system
RUN pip install poetry==1.1.11

# Copy the library source code
COPY pyproject.toml poetry.lock /app/

# Install the application
WORKDIR /app/$APP
RUN poetry install --no-root --no-ansi --no-dev


# =============== PRODUCTION ===============
FROM base AS production

# Copy the build artifact
COPY --from=builder /app /app/$APP
COPY $APP/main.py /app/$APP

WORKDIR /app/$APP
ENTRYPOINT [".venv/bin/python3"]
CMD ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
