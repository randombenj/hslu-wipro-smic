from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, select
from datetime import datetime
from datastore.model import Label, LabelAssignment, Meter, Measurement
from pydantic import BaseModel

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


@app.get("/meters")
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
def read_measurements(meter_id: int, start_date: datetime = None, end_date: datetime = None):
    with Session(engine) as session:
        query = session.query(Measurement).filter(
            Measurement.meter_id == meter_id)
        if start_date:
            query = query.filter(Measurement.capture_time >= start_date)
        if end_date:
            query = query.filter(Measurement.capture_time <= end_date)

        measurements = query.all()
        return measurements


class LabelAssignmentPostData(BaseModel):
    label_id: int
    start_time: datetime
    end_time: datetime


@app.post("/meters/{meter_id}/labels")
def assign_label(meter_id: int, data: LabelAssignmentPostData):
    with Session(engine) as session:
        assigmnet = LabelAssignment(meter_id=meter_id,
                                    label_id=data.label_id,
                                    start_time=data.start_time,
                                    end_time=data.end_time)
        session.add(assigmnet)
        return "Label assigned successfuly!"


@app.get("/meters/{meter_id}/labels")
def get_assigned_labels(meter_id: int):
    with Session(engine) as session:
        labels = session.query(LabelAssignment.start_time, LabelAssignment.end_time, Label.name).filter(
            LabelAssignment.meter_id == meter_id).join(Label).all()
        return labels


@app.get("/labels")
def get_labels():
    with Session(engine) as session:
        labels = session.query(Label).all()
        return labels


@app.post("/db/setDefaults")
def set_defaults():
    clear_db()
    with Session(engine) as session:
        meter1 = Meter(serial_number="Meter one", id=1)
        meter2 = Meter(serial_number="Meter two", id=2)
        for i in range(0, 59):
            session.add(Measurement(meter_id=meter1.id, voltage_phase_1=10+i,
                                    voltage_phase_2=(i*i) % 230, voltage_phase_3=30, capture_time=datetime(2020, 1, 1, 0, 0, i)))

        session.add(meter1)
        session.add(meter2)

        label1 = Label(name="Label one", id=1)
        label2 = Label(name="Label two", id=2)
        ass1 = LabelAssignment(meter_id=meter1.id, label_id=label1.id, start_time=datetime(
            2020, 1, 1, 0, 0, 0), end_time=datetime(2020, 1, 1, 0, 0, 10))
        session.add(label1)
        session.add(label2)
        session.add(ass1)
        session.commit()
        return "Default set successfuly!"


@app.post("/db/clear")
def clear_db():
    with Session(engine) as session:
        session.query(Meter).delete()
        session.query(Measurement).delete()
        session.query(Label).delete()
        session.query(LabelAssignment).delete()
        session.commit()
        return "DB cleared successfuly!"


if __name__ == "__main__":
    import os
    import uvicorn

    host = os.getenv("SMIC_HOST", "0.0.0.0")
    port = int(os.getenv("SMIC_PORT", 8080))

    uvicorn.run(app, host=host, port=port)
