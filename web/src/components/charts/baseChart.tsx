// from https://github.com/ihsavru/d3-examples/blob/main/src/components/BaseChart/index.js
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import drawAxis from './axis';
import { Line } from './lineChart';
import { Point } from '../../VoltageData';
// import drawTooltip from './tooltip';

// import './index.scss';

interface BaseChartPropsType {
  axisProps: any;
  lines: Line[];
  svgProps: any;
  [x: string]: any;

}

const BaseChart = (drawChart: any, extraProps: any) => {

  function Chart(props: BaseChartPropsType) {
    const svgRef = React.createRef<SVGSVGElement>();
    const { axisProps, lines, svgProps } = props;

    const { margin, width, height } = svgProps;

    const allPoints: Point[] = [];
    lines.forEach(line => {
      allPoints.push(...line.points);
    });

    const yMinValue = d3.min(allPoints, (d: Point) => d[1]) as number;
    const yMaxValue = d3.max(allPoints, (d: Point) => d[1]) as number;

    const xMinValue = d3.min(allPoints, (d: Point) => d[0]) as number;
    const xMaxValue = d3.max(allPoints, (d: Point) => d[0]) as number;

    let xScale: any = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    let yScale: any = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, yMaxValue]);

    useEffect(() => {
      flushChart();
      draw();
    });

    function flushChart() {
      d3.select(svgRef.current).selectAll('*').remove();
    }

    function draw() {
      const svg = d3
        .select(svgRef.current)
        // .attr('height', "100%")
        // .attr('width', "100%")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .attr('viewbox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        // .attr('preserveAspectRatio', "xMidYMid meet")
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      drawAxis({
        ...axisProps,
        ...svgProps,
        ...extraProps,
        svgRef,
        xScale,
        yScale,
      });

      drawChart({
        svgRef,
        lines,
        xScale,
        yScale,
        ...svgProps,
      });

      //   drawTooltip({
      //     useScaleBands,
      //     svgRef,
      //     tooltipRef,
      //     data,
      //     xScale,
      //     yScale,
      //     findHoverData,
      //     ...svgProps,
      //     ...restProps,
      //   });
    }
    return (
      <svg
        ref={svgRef}
      />
    )
  }

  Chart.defaultProps = {
    scaleBandPadding: 0.05,
  }

  return Chart;
}
export default BaseChart;