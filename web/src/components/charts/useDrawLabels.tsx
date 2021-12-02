import * as d3 from 'd3';
import { useEffect } from "react";
import { DateTime } from "luxon";
import { Svg } from './SMICChart';
import { Scales } from "./Scales";

export const useDrawLabels = (svgRef: Svg, scales: Scales | null, height: number) => {
    const ray = [
        { start: DateTime.local(2020, 1, 1, 0, 0, 0), end: DateTime.local(2020, 1, 1, 0, 0, 10), color: 'red' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 5), end: DateTime.local(2020, 1, 1, 0, 0, 9), color: 'blue' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 15), end: DateTime.local(2020, 1, 1, 0, 0, 21), color: 'green' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 17), end: DateTime.local(2020, 1, 1, 0, 0, 40), color: 'yellow' },
    ];
    useEffect(() => {
        if (scales) {

            const svg = d3.select(svgRef.current).select('g');
            console.log('draw labels');
            ray.forEach(label => {
                svg.append('rect')
                    .attr('x', scales.x(label.start))
                    .attr('y', 0)
                    .attr('width', scales.x(label.end) - scales.x(label.start))
                    .attr('height', height)
                    .attr('fill', label.color)
                    .attr('opacity', 0.5);
            });
        }
    }, [scales, height, ray]);

};
