import * as d3 from 'd3';
import { useEffect } from "react";
import React from "react";
import { Svg } from './SMICChart';
import { Margin } from "./Margin";


export const useCreateBase = (width: number, height: number, margin: Margin): [Svg, JSX.Element] => {
    const svgRef = React.createRef<SVGSVGElement>();
    const element = <svg
        ref={svgRef} />;
    useEffect(() => {
        console.log("create base");
        d3.select(svgRef.current).selectAll('*').remove();
        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", "0");
    }, [width, height, margin]);

    return [svgRef, element];
};
