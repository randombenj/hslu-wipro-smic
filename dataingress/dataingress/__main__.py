import uuid
import json
import logging

from sqlmodel import create_engine, Session, SQLModel, select
from paho.mqtt import client as mqtt_client

from datastore.model import Meter, Measurement


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True)


SQLModel.metadata.create_all(engine)


class SMICIngress:
    def __init__(self, broker="0.0.0.0", port=1883, subscribe_to_topic="smic/monitoring-data"):
        self._client_id = f'smic-{uuid.uuid4()}'
        self._client = mqtt_client.Client(self._client_id)
        self._client.username_pw_set("insecure", "insecure")
        self._client.on_connect = self.__on_connect
        self._client.connect(broker, port)
        self._client.subscribe(subscribe_to_topic)
        self._client.on_message = self.__on_message
        self._client.loop_start()

    def __on_message(self, client, userdata, message):
        logging.info(f"Got `{message.payload.decode()}` from `{message.topic}`")
        data = json.loads(message.payload.decode())
        # FIXME: decouple message handling and db inserting ...
        with Session(engine) as session:
            # get or insert meter
            meter = session.exec(
                select(Meter).where(Meter.serial_number == data["meter_serial"])
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

            # insert data
            measurement = Measurement(
                voltage_phase_1=data["voltage_phase_1"],
                voltage_phase_2=data["voltage_phase_2"],
                voltage_phase_3=data["voltage_phase_3"],
                meter_id=meter.id,
                capture_time=data["capture_time"],
            )
            session.add(measurement)
            session.commit()

    def __on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logging.info("Connected to MQTT Broker!")
        else:
            logging.warn(f"Failed to connect, return code {rc}")


if __name__ == "__main__":
    client = SMICIngress()
    try:
        while True:
            ...
    except KeyboardInterrupt:
        pass
