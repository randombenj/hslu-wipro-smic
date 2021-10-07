from typing import Optional
from sqlmodel import Field, SQLModel


class Meter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    serial_number: str


class Metric(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    voltage_phase_1: float
    voltage_phase_2: float
    voltage_phase_3: float

    meter_id: Optional[int] = Field(default=None, foreign_key="meter.id")
