import { type } from "os";

// this represents the Measurement class from the API
export interface Measurement {
    id: number;
    capture_time: string;
    voltage_phase_1: number;
    voltage_phase_2: number;
    voltage_phase_3: number;
    meter_id: number;

}


export class Data implements VoltagePoints {
    constructor(private measurements: Measurement[]) {
        this.measurements = measurements;
        this.phase1_points = [];
        this.phase2_points = [];
        this.phase3_points = [];
        this.all_points = [];
        this.measurements.forEach(measurement => {
            const timestamp = new Date(measurement.capture_time).getSeconds();
            this.phase1_points.push([measurement.voltage_phase_1, timestamp]);
            this.phase2_points.push([measurement.voltage_phase_2, timestamp]);
            this.phase3_points.push([measurement.voltage_phase_3, timestamp]);
        });
        this.all_points = this.phase1_points.concat( this.phase2_points, this.phase3_points);

    }
    public phase1_points: Point[];
    public phase2_points: Point[];
    public phase3_points: Point[];
    public all_points: Point[];
}

export interface VoltagePoints {
    phase1_points: Point[];
    phase2_points: Point[];
    phase3_points: Point[];
}

export type Point = [number, number];