import time
import logging

from sqlmodel import create_engine, Session, SQLModel, select

from datastore.model import Meter, Measurement


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)


SQLModel.metadata.create_all(engine)


def handle_message(data: dict):
    """
    Handles a message with retry and backoff

    Args:
      data: The data to serialize and store to the database
    """
    retry = 0
    timeout = time.time() + 60  # seconds

    while True:
        if time.time() > timeout:
            return  # at least we tryed ... (╯°□°)╯︵ ┻━┻

        try:
            with Session(engine) as session:
                # get or insert meter
                meter = session.exec(
                    select(Meter).where(
                        Meter.serial_number == data["meter_serial"])
                ).all()
                if len(meter) > 0:
                    meter = meter[0]
                else:
                    meter = Meter(
                        serial_number=data["meter_serial"]
                    )
                    session.add(meter)
                    session.commit()
                    session.refresh(meter)  # get id
                if "capture_time" not in data:
                    raise Exception("capture_time not provided")
                # insert data
                measurement = Measurement(
                    meter_id=meter.id,
                    capture_time=data["capture_time"],
                    voltage_phase_1=data.get("voltage_phase_1", 0),
                    voltage_phase_2=data.get("voltage_phase_2", 0),
                    voltage_phase_3=data.get("voltage_phase_3", 0),
                    power=data.get("power", 0),
                    thd_1=data.get("thd_1", 0),
                    thd_2=data.get("thd_2", 0),
                    thd_3=data.get("thd_3", 0),
                    thd_4=data.get("thd_4", 0),
                    thd_5=data.get("thd_5", 0),
                    thd_6=data.get("thd_6", 0),
                    thd_7=data.get("thd_7", 0),
                    thd_8=data.get("thd_8", 0),
                    thd_9=data.get("thd_9", 0),
                    thd_10=data.get("thd_10", 0),
                )
                session.add(measurement)
                session.commit()

                return  # success

        except Exception as e:
            logging.warn(f"Unable to store to the database, retry {retry}", e)