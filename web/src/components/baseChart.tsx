// from https://github.com/ihsavru/d3-examples/blob/main/src/components/BaseChart/index.js
import React, { createRef, useEffect } from 'react';
import * as d3 from 'd3';
import classnames from 'classnames';
import drawAxis from './axis';
import { Data, Point } from '../data';
// import drawTooltip from './tooltip';

// import './index.scss';

interface BaseChartPropsType {
  axisProps: any;
  data: Data;
  svgProps: any;
  // tooltipClass:string;
  scaleBandPadding: number;
  restProps: any;
  [x: string]: any;
}

const BaseChart = (drawChart: any, extraProps: any) => {

  function Chart(props: BaseChartPropsType | any) {
    const svgRef = React.createRef<SVGSVGElement>();
    const tooltipRef = React.createRef();
    const { axisProps, data, svgProps, /*tooltipClass,*/ scaleBandPadding, ...restProps } = props;
    const { useScaleBands, findHoverData } = extraProps;

    const { margin, width, height, svgContainerClass } = svgProps;

    const yMinValue = d3.min(data.all_points, (d: Point) => d[1]) as number;
    const yMaxValue = d3.max(data.all_points, (d: Point) => d[1]) as number;

    const xMinValue = d3.min(data.all_points, (d: Point) => d[0]) as number;
    const xMaxValue = d3.max(data.all_points, (d: Point) => d[0]) as number;

    let xScale: any = d3
      .scaleLinear()
      .domain([xMinValue, xMaxValue])
      .range([0, width]);

    if (useScaleBands.x) {
      //   xScale = d3.scaleBand()
      //     .range([0, width])
      //     .domain(data.all_points.map((d:Point) => d[0]))
      //     .padding(scaleBandPadding);
    }

    let yScale: any = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, yMaxValue]);

    if (useScaleBands.y) {
      //   yScale = d3.scaleBand()
      //     .range([height, 0])
      //     .domain(data.all_points.map((d:Point) => d[1]))
      //     .padding(scaleBandPadding);
    }

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
        data,
        svgRef,
        xScale,
        yScale,
      });

      drawChart({
        svgRef,
        data,
        xScale,
        yScale,
        ...svgProps,
        ...restProps,
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