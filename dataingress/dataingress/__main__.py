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
        #logging.info(f"Got `{message.payload.decode()}` from `{message.topic}`")
        print(f"Got `{message.payload.decode()}` from `{message.topic}`")
        data = json.loads(message.payload.decode())
        # FIXME: decouple message handling and db inserting ...
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
