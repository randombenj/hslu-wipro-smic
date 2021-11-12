import csv
from fakemeter import SMICCLient
import json
from datetime import datetime
from time import sleep
from tqdm import tqdm
file = 'data-examples/E3DC-Export Oktober.csv'
client = SMICCLient()


with open(file, 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=';', quotechar='|')
    next(reader)
    for row in tqdm(reader):
        data = json.dumps({
            "meter_serial": "Markus Home",
            "capture_time": datetime.strptime(row[0], "%d.%m.%Y %H:%M").isoformat(),
            "voltage_phase_1": 0,
            "voltage_phase_2": 0,
            "voltage_phase_3": 0,
            "power": row[5],
        })
        res = client.send(data)
        sleep(0.1)
