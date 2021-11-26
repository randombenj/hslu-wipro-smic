// from https://github.com/ihsavru/d3-examples/blob/main/src/components/LineChart/index.js
// from http://bl.ocks.org/paradite/71869a0f30592ade5246
import BaseChart from './baseChart';
import classnames from 'classnames';
import * as d3 from 'd3';

import { Point } from '../../model/Point';
import { ScaleLinear, ScaleTime } from 'd3';
import { DateTime } from 'luxon';
import { distanceAndSkiddingToXY } from '@popperjs/core/lib/modifiers/offset';


export interface LineChartsPropsType {
    svgRef: any;
    lines: Line[];
    labels: LabelOnChart[];
    xScale: ScaleTime<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
    width: any;
    height: any;
    margin: any;
    lineClass: any;
    strokeWidth: any;
}

export interface LabelOnChart {
    start: Date;
    end: Date;
    color: string;
}

export interface Line {
    points: Point[];
    color: string;
}


function drawLineChart(props: LineChartsPropsType) {
    const {
        svgRef,
        lines,
        labels,
        xScale,
        yScale,
        width,
        height,
        margin,
        lineClass,
        strokeWidth,
    } = props;

    const svg = d3.select(svgRef.current).select('g');
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("opacity", "0");
    const d3Line = d3
        .line()
        .x((d: [number, number]) => xScale(d[0]))
        .y((d: [number, number]) => yScale(d[1]))
        .curve(d3.curveMonotoneX);

    lines.forEach(line => {
        svg
            .append('path')
            .datum(line.points as any)
            .attr('fill', 'none')
            .attr('stroke-width', strokeWidth)
            .attr('stroke', line.color)
            .attr('class', 'line')
            .attr('d', d3Line)
            .attr('class', classnames(['line-chart__path', lineClass]));

    })
    const ray = [
        { start: DateTime.local(2020, 1, 1, 0, 0, 0), end: DateTime.local(2020, 1, 1, 0, 0, 10), color: 'red' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 5), end: DateTime.local(2020, 1, 1, 0, 0, 9), color: 'blue' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 15), end: DateTime.local(2020, 1, 1, 0, 0, 21), color: 'green' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 17), end: DateTime.local(2020, 1, 1, 0, 0, 40), color: 'yellow' },

    ];
    ray.forEach(label => {
        svg.append('rect').attr('class', 'line-chart__label')
            .attr('x', xScale(label.start))
            .attr('y', 0)
            .attr('width', xScale(label.end) - xScale(label.start))
            .attr('height', height)
            .attr('fill', label.color)
            .attr('opacity', 0.5);
    });



    var selectionRect = {
        element: null,
        previousElement: null,
        currentY: 0,
        currentX: 0,
        originX: 0,
        originY: 0,
        setElement: function (ele: Selection) {
            this.previousElement = this.element;
            this.element = ele;
        },
        getNewAttributes: function () {
            var x = this.currentX < this.originX ? this.currentX : this.originX;
            var y = this.currentY < this.originY ? this.currentY : this.originY;
            var width = Math.abs(this.currentX - this.originX);
            var height = Math.abs(this.currentY - this.originY);
            return {
                x: x,
                y: y,
                width: width,
                height: height
            };
        },
        getCurrentAttributes: function () {
            // use plus sign to convert string into number
            var x = +this.element.attr("x");
            var y = +this.element.attr("y");
            var width = +this.element.attr("width");
            var height = +this.element.attr("height");
            return {
                x1: x,
                y1: y,
                x2: x + width,
                y2: y + height
            };
        },
        getCurrentAttributesAsText: function () {
            var attrs = this.getCurrentAttributes();
            return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
        },
        init: function (newX: number, newY: number) {
            var rectElement = svg.append("rect")
                .attr('rx', 4).attr('ry', 4).attr('opacity', 0.3)
                .classed("selection", true);
            this.setElement(rectElement);
            this.setAttrs(0, 0, 0, 0);
            this.originX = newX;
            this.originY = newY;
            this.update(newX, newY);
        },
        update: function (newX: number, newY: number) {
            this.currentX = newX;
            this.currentY = newY;
            const { x, y, width, height } = this.getNewAttributes();
            this.setAttrs(x, y, width, height);
            // this.element.attr(this.getNewAttributes());
        },

        setAttrs(x: number, y: number, width: number, height: number) {
            this.element.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
        },
        focus: function () {
            this.element
                .style("stroke", "#DE695B")
                .style("stroke-width", "2.5");
        },
        remove: function () {
            this.element.remove();
            this.element = null;
        },
        removePrevious: function () {
            if (this.previousElement) {
                this.previousElement.remove();
            }
        }
    };
    function dragStart(event) {
        var p = d3.pointer(event, this.element);
        selectionRect.init(p[0], p[1]);
        selectionRect.removePrevious();
    }
    function dragMove(event) {
        var p = d3.pointer(event, this);
        selectionRect.update(p[0], p[1]);
    }

    function dragEnd(event) {
        var finalAttributes = selectionRect.getCurrentAttributes();
        if (finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1) {
            selectionRect.focus();
        } else {
            selectionRect.remove();
        }
        console.log(xScale.invert(finalAttributes.x1))
        console.log(xScale.invert(finalAttributes.x2))
    }
    var dragBehavior = d3.drag()
        .on("drag", dragMove)
        .on("start", dragStart)
        .on("end", dragEnd);

    svg.call(dragBehavior);


}
const LineChart = BaseChart(drawLineChart, {
    useScaleBands: {
        x: true,
        y: true
    },

})
export default LineChart;