import random
import logging

from paho.mqtt import client as mqtt_client


broker = "mqtt"
port = 1883
topic = "python/mqtt"
# generate client ID with pub prefix randomly
client_id = f"python-mqtt-{random.randint(0, 100)}"


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            logging.debug("Connected to MQTT Broker!")
        else:
            logging.debug(f"Failed to connect, return code {rc}")

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        logging.debug(f"Received '{msg.payload.decode()}' from '{msg.topic}' topic")

    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == "__main__":
    run()