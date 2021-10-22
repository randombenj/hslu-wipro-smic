from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session
from datetime import datetime
from datastore.model import Meter, Measurement


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


@app.get("/meters/{meter_id}/measurements")
def read_measurements(meter_id: int):
    with Session(engine) as session:
        measurements = session.query(Measurement).filter(Measurement.meter_id == meter_id).all()
        return measurements


@app.post("/db/setDefaults")
def set_defaults():
    with Session(engine) as session:
        session.query(Meter).delete()
        session.query(Measurement).delete()
        meter1 = Meter(serial_number="Meter one", id=1)
        meter2 = Meter(serial_number="Meter two", id=2)
        measurement1 = Measurement(meter_id=meter1.id, voltage_phase_1=10,
                                   voltage_phase_2=20, voltage_phase_3=30, capture_time=datetime.now())
        session.add(meter1)
        session.add(meter2)
        session.add(measurement1)
        session.commit()


if __name__ == "__main__":
    import os
    import uvicorn

    host = os.getenv("SMIC_HOST", "0.0.0.0")
    port = int(os.getenv("SMIC_PORT", 8000))

    uvicorn.run(app, host=host, port=port)