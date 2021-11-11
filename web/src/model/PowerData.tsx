import { Line } from "../components/charts/lineChart";
import { Measurement } from "./Measurement";
import { Point } from "./Point";



class PowerLine implements Line {
    constructor(public points: Point[], public color: string) {
    }
}

export function mapMeasurementsToPowerLine(measurements: Measurement[]): PowerLine {


    const points: Point[] = []
    measurements.forEach(measurement => {
        const timestamp = new Date(measurement.capture_time);
        points.push([timestamp, measurement.power]);

    });


    return new PowerLine(points, "black");
}



