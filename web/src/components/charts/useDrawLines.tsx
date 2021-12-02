import * as d3 from 'd3';
import { useEffect } from "react";
import { Line } from '../../model/Line';
import { Svg } from './SMICChart';
import { Scales } from "./Scales";

export const useDrawLines = (svg: Svg, lines: Line[], scales: Scales | null, strokeWidth: number = 4) => {
    useEffect(() => {
        if (scales && lines[0].points.length > 0) {
            console.log('drawing lines');
            const d3Line = d3
                .line()
                .x((d: [number, number]) => scales.x(d[0]))
                .y((d: [number, number]) => scales.y(d[1]))
                .curve(d3.curveMonotoneX);

            lines.forEach(line => {
                d3.select(svg.current).select('g')
                    .append('path')
                    .datum(line.points as any)
                    .attr('fill', 'none')
                    .attr('stroke-width', strokeWidth)
                    .attr('stroke', line.color)
                    .attr('class', 'line')
                    .attr('d', d3Line);

            });
        }
    }, [lines, scales, strokeWidth]);
};
