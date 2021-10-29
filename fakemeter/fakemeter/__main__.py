import json
import argparse

from datetime import datetime

from fakemeter import SMICCLient


def run():
    parser = argparse.ArgumentParser()
    parser.add_argument("--meter-serial", help="Smart meter srial number", default="1")
    parser.add_argument("voltage1")
    parser.add_argument("voltage2")
    parser.add_argument("voltage3")

    args = parser.parse_args()

    client = SMICCLient()
    res = client.send(json.dumps({
        "meter_serial": args.meter_serial,
        "capture_time": datetime.now().isoformat(),
        "voltage_phase_1": args.voltage1,
        "voltage_phase_2": args.voltage2,
        "voltage_phase_3": args.voltage3,
    }))
    print(res)


if __name__ == "__main__":
    run()