// from https://github.com/ihsavru/d3-examples/blob/main/src/components/LineChart/index.js

import BaseChart from './baseChart';
import classnames from 'classnames';
import * as d3 from 'd3';
import { Point } from '../../VoltageData';


export interface LineChartsPropsType {
    svgRef: any;
    lines: Line[];
    xScale: any;
    yScale: any;
    width: any;
    height: any;
    margin: any;
    lineClass: any;
    strokeWidth: any;
}

export interface Line {
    points: Point[];
    color: string;
}


function drawLineChart(props: LineChartsPropsType) {
    const {
        svgRef,
        lines,
        xScale,
        yScale,
        width,
        height,
        margin,
        lineClass,
        strokeWidth,
    } = props;

    const svg = d3.select(svgRef.current).select('g');
    const d3Line = d3
        .line()
        .x((d: Point) => xScale(d[0]))
        .y((d: Point) => yScale(d[1]))
        .curve(d3.curveMonotoneX);

    lines.forEach(line => {
        svg
            .append('path')
            .datum(line.points)
            .attr('fill', 'none')
            .attr('stroke-width', strokeWidth)
            .attr('stroke', line.color)
            .attr('class', 'line')
            .attr('d', d3Line)
            .attr('class', classnames(['line-chart__path', lineClass]));

    })

}
const LineChart = BaseChart(drawLineChart, {
    useScaleBands: {
        x: true,
        y: true
    },

})
export default LineChart;