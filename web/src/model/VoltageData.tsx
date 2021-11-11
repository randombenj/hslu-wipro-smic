import { Line } from "../components/charts/lineChart";
import { Measurement } from "./Measurement";
import { Point } from "./Point";


class VoltageLine implements Line {
    constructor(public points: Point[], public color: string) {
    }
}

export function mapMeasurementsToVoltageLines(measurements: Measurement[]): Line[] {
    const lines = []
    let phase1_points: Point[] = [];
    let phase2_points: Point[] = [];
    let phase3_points: Point[] = [];
    measurements.forEach(measurement => {
        const timestamp = new Date(measurement.capture_time);
        phase1_points.push([timestamp, measurement.voltage_phase_1]);
        phase2_points.push([timestamp, measurement.voltage_phase_2]);
        phase3_points.push([timestamp, measurement.voltage_phase_3]);
    });
    lines.push(new VoltageLine(phase1_points, "green"))
    lines.push(new VoltageLine(phase2_points, "red"))
    lines.push(new VoltageLine(phase3_points, "blue"))
    return lines;
}



