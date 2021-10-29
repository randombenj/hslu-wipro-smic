// from https://github.com/ihsavru/d3-examples/blob/main/src/components/LineChart/index.js

import BaseChart from './baseChart';
import classnames from 'classnames';
import * as d3 from 'd3';
import { Point } from '../data';
import { LineChartsPropsType } from './PropsType';


function drawLineChart(props: LineChartsPropsType) {
    const {
        svgRef,
        data,
        xScale,
        yScale,
        width,
        height,
        margin,
        lineClass,
        strokeWidth,
    } = props;

    const svg = d3.select(svgRef.current).select('g');

    const line = d3
        .line()
        .x((d: Point) => xScale(d[0]))
        .y((d: Point) => yScale(d[1]))
        .curve(d3.curveMonotoneX);


    svg
        .append('path')
        .datum(data.phase1_points)
        .attr('fill', 'none')
        .attr('stroke-width', strokeWidth)
        .attr('stroke', 'steelblue')
        .attr('class', 'line')
        .attr('d', line)
        .attr('class', classnames(['line-chart__path', lineClass]));

    svg
        .append('path')
        .datum(data.phase2_points)
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('stroke', 'red')
        .attr('class', 'line')
        .attr('d', line)
        .attr('class', classnames(['line-chart__path', lineClass]));

    svg
        .append('path')
        .datum(data.phase3_points)
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('stroke', 'green')
        .attr('class', 'line')
        .attr('d', line)
        .attr('class', classnames(['line-chart__path', lineClass]));
}
const LineChart = BaseChart(drawLineChart, {
    useScaleBands: {
        x: true,
        y: true
    },

})
export default LineChart;