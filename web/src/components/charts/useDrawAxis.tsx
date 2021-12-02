import * as d3 from 'd3';
import { useEffect } from "react";
import { Svg } from './SMICChart';
import { Scales } from "./Scales";
import { Margin } from "./Margin";

export const useDrawAxis = (xText: string, yText: string, svgRef: Svg, scales: Scales | null, height: number, width: number, margin: Margin) => {
    useEffect(() => {
        if (scales) {

            const svg = d3.select(svgRef.current).select('g');
            svg
                .append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(scales.x));

            svg
                .append('g')
                .call(d3.axisLeft(scales.y));

            svg
                .append('text')
                .attr('class', 'base__axis-label axis__x-label')
                .attr('text-anchor', 'middle')
                .attr('x', width / 2)
                .attr('y', height + margin.top / 2)
                .text(xText);

            svg
                .append('text')
                .attr('class', 'base__axis-label axis__y-label')
                .attr('text-anchor', 'middle')
                .attr('x', -height / 2)
                .attr('y', -margin.left / 2)
                .attr('transform', 'rotate(-90)')
                .text(yText);
        }
    }, [scales]);
};
