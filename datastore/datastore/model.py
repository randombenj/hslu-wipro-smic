from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime


class Meter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    serial_number: str


class Measurement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    meter_id: Optional[int] = Field(default=None, foreign_key="meter.id")
    capture_time: datetime = Field()
    voltage_phase_1: float = Field(default=0.0)
    voltage_phase_2: float = Field(default=0.0)
    voltage_phase_3: float = Field(default=0.0)
    power: float = Field(default=0.0)
    thd_1: float = Field(default=0.0)
    thd_2: float = Field(default=0.0)
    thd_3: float = Field(default=0.0)
    thd_4: float = Field(default=0.0)
    thd_5: float = Field(default=0.0)
    thd_6: float = Field(default=0.0)
    thd_7: float = Field(default=0.0)
    thd_8: float = Field(default=0.0)
    thd_9: float = Field(default=0.0)
    thd_10: float = Field(default=0.0)


class Label(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str


class LabelAssignment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    label_id: Optional[int] = Field(default=None, foreign_key="label.id")
    meter_id: Optional[int] = Field(default=None, foreign_key="meter.id")
    start_time: datetime = Field()
    end_time: datetime = Field()
