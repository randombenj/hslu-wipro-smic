import json
import argparse

from datetime import datetime

from fakemeter import SMICCLient


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--meter-serial", help="Smart meter srial number", default="1")
    parser.add_argument("voltage1")
    parser.add_argument("voltage2")
    parser.add_argument("voltage3")
    parser.add_argument("power", default=0)

    args = parser.parse_args()

    client = SMICCLient()
    data = json.dumps({
        "meter_serial": args.meter_serial,
        "capture_time": datetime.now().isoformat(),
        "voltage_phase_1": args.voltage1,
        "voltage_phase_2": args.voltage2,
        "voltage_phase_3": args.voltage3,
        "power": args.power,
        "thd_1": 0.1,
        "thd_2": 0.2,
        "thd_3": 0.3,
        "thd_4": 0.4,
        "thd_5": 0.5,
        "thd_6": 0.6,
        "thd_7": 0.7,
        "thd_8": 0.8,
        "thd_9": 0.9,
        "thd_10": 1,
    })
    res = client.send(data)
    print(res)


if __name__ == "__main__":
    run()
