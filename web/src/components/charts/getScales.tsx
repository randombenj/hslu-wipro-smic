import * as d3 from 'd3';
import { Point } from "../../model/Point";
import { Line } from '../../model/Line';
import { calcMinMax } from "./calcMinMax";
import { Scales } from "./Scales";

export const getScales = (lines: Line[], height: number, width: number): Scales | null => {

    const allPoints: Point[] = [];
    lines.forEach(line => {
        allPoints.push(...line.points);
    });
    const { xMinValue, xMaxValue, yMaxValue }: { xMinValue: Date; xMaxValue: Date; yMaxValue: number; } = calcMinMax(allPoints);

    const x = d3
        .scaleTime()
        .domain([xMinValue, xMaxValue])
        .range([0, width]);

    const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, yMaxValue]);


    return { x, y };
};
