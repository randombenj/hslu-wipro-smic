import ssl
import uuid
import json
import logging

from paho.mqtt import client as mqtt_client

from dataingress.messagehandler import handle_message


class SMICIngress:
    def __init__(self, broker="0.0.0.0", port=8883, subscribe_to_topic="smic/monitoring-data"):
        self._client_id = f'smic-{uuid.uuid4()}'
        self._client = mqtt_client.Client(self._client_id)
        self._client.tls_set(
            ca_certs="/ca.crt",
            cert_reqs=ssl.CERT_NONE,
            #certfile="/client.crt",
            #keyfile="/client.key",
            tls_version=ssl.PROTOCOL_TLSv1_2
        )
        self._client.tls_insecure_set(True)
        self._client.username_pw_set("insecure", "insecure")
        self._client.on_connect = self.__on_connect
        self._client.connect(broker, port)
        self._client.subscribe(subscribe_to_topic)
        self._client.on_message = self.__on_message
        self._client.loop_start()

    def __on_message(self, client, userdata, message):
        logging.info(f"Got `{message.payload.decode()}` from `{message.topic}`")
        data = json.loads(message.payload.decode())
        handle_message(data)

    def __on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logging.info("Connected to MQTT Broker!")
        else:
            logging.warn(f"Failed to connect, return code {rc}")


if __name__ == "__main__":
    # configure logging to log to stdout
    import sys
    logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

    client = SMICIngress()
    try:
        while True:
            ...
    except KeyboardInterrupt:
        pass
