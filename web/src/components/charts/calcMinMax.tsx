import * as d3 from 'd3';
import { Point } from "../../model/Point";


export function calcMinMax(allPoints: Point[]) {
    let yMinValue: number = 0;
    let yMaxValue: number = 0;
    let xMinValue: Date = new Date(0);
    let xMaxValue: Date = new Date(0);
    if (allPoints.length > 0) {
        yMinValue = d3.min(allPoints, (d: Point) => d[1]) as number;
        yMaxValue = d3.max(allPoints, (d: Point) => d[1]) as number;

        xMinValue = allPoints.reduce((a, b) => a[0] < b[0] ? a : b)[0];
        xMaxValue = allPoints.reduce((a, b) => a[0] > b[0] ? a : b)[0];
    }
    return { xMinValue, xMaxValue, yMaxValue };
}
