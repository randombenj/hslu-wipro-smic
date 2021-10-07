from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session

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


@app.get("/meters/")
def read_usage():
    with Session(engine) as session:
        meters = session.query(Meter).all()
        return meters

@app.get("/meters/{meter_id}/")
def read_meter(meter_id: int):
    with Session(engine) as session:
        meter = session.query(Meter).filter(Meter.id == meter_id).first()
        return meter

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)