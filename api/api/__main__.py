from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from datastore.model import Meter, Metric


SQLITE_FILE_NAME = "database.db"
sqlite_url = f"sqlite:///{SQLITE_FILE_NAME}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/usages/")
def create_usage(usage: Usage):
    return "TODO"


@app.get("/usages/")
def read_usage():
    return "TODO"
