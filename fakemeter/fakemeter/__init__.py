import uuid
import logging

from dataclasses import dataclass

from paho.mqtt import client as mqtt_client


@dataclass
class MQTTResult:
    status: int


class SMICCLient:
    def __init__(self, broker="localhost", port=1883):
        self._client_id = f'smic-{uuid.uuid4()}'
        self._client = mqtt_client.Client(self._client_id)
        self._client.username_pw_set("insecure", "insecure")
        self._client.on_connect = self.__on_connect
        self._client.connect(broker, port)
        self._client.loop_start()

    def __on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logging.info("Connected to MQTT Broker!")
        else:
            logging.warn(f"Failed to connect, return code {rc}")

    def send(self, message: str, topic="smic/monitoring-data") -> MQTTResult:
        result = self._client.publish(topic, message)
        status = result[0]
        if status == 0:
            logging.info(f"Send `{message}` to topic `{topic}`")
        else:
            logging.warn(f"Failed to send message to topic {topic}")

        return MQTTResult(status)
