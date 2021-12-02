
import Paper from '@mui/material/Paper';
import * as d3 from 'd3';
import { useEffect } from "react";
import { DateTime } from "luxon";
import React from "react";
import { Point } from "../../model/Point";
import {Line} from '../../model/Line'

interface porps {
    lines: Line[];
    yAxisName: string;
}

const NewChart = (props: porps) => {
    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = 500;
    const height = width;
    const margin = { top, bottom, left, right };

    const [svg, baseChartElement] = useCreateBase(height, width, margin);
    const scales = getScales(props.lines, height, width);
    const range = useSelectRangeWithDrag(svg, scales);
    useDrawAxis("Time", props.yAxisName, svg, scales, height, width, margin);
    useDrawLines(svg, props.lines, scales);
    useDrawLabels(svg, scales, height);
    return (
        <Paper elevation={3} style={{ width: width + left + right }}>
            {baseChartElement}

        </Paper>
    )
}
export default NewChart;

type Svg = any;

export const useCreateBase = (width: number, height: number, margin: any): [Svg, JSX.Element] => {
    const svgRef = React.createRef<SVGSVGElement>();
    const element = <svg
        ref={svgRef}
    />
    useEffect(() => {
        console.log("create base")
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

    return [svgRef, element]
}

const useDrawLines = (svg: Svg, lines: Line[], scales: Scales | null, strokeWidth: number = 4) => {
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
}
interface SelectedRange {
    start: DateTime;
    end: DateTime;
}
const useSelectRangeWithDrag = (svgRef: Svg, scales: Scales | null): SelectedRange | null => {
    const [range, setRange] = React.useState<SelectedRange | null>();
    const [selection, setSelection] = React.useState<any | null>(null)
    useEffect(() => {
        const svg = d3.select(svgRef.current).select("g");
        let element = null;
        let previousElement = null;
        let currentY = 0;
        let currentX = 0;
        let originX = 0;
        let originY = 0;

        const setElement = (ele: d3.Selection<SVGRectElement, unknown, null, undefined>) => {
            previousElement = element;
            element = ele;
        }


        const getNewAttributes = () => {
            var x = currentX < originX ? currentX : originX;
            var y = currentY < originY ? currentY : originY;
            var width = Math.abs(currentX - originX);
            var height = Math.abs(currentY - originY);
            return {
                x: x,
                y: y,
                width: width,
                height: height
            };
        }
        const getCurrentAttributes = () => {
            // use plus sign to convert string into number
            var x = +element.attr("x");
            var y = +element.attr("y");
            var width = +element.attr("width");
            var height = +element.attr("height");
            return {
                x1: x,
                y1: y,
                x2: x + width,
                y2: y + height
            };
        }

        const init = (newX: number, newY: number) => {

            var rectElement = svg.append("rect")
                .attr('rx', 4).attr('ry', 4).attr('opacity', 0.3)
                .classed("selection", true);
            setElement(rectElement);
            setAttrs(0, 0, 0, 0);
            originX = newX;
            originY = newY;
            update(newX, newY);
        }
        const update = (newX: number, newY: number) => {
            currentX = newX;
            currentY = newY;
            const { x, y, width, height } = getNewAttributes();
            setAttrs(x, y, width, height);
            // element.attr(this.getNewAttributes());
        }

        const setAttrs = (x: number, y: number, width: number, height: number) => {
            element.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
        }
        const focus = () => {
            element
                .style("stroke", "#DE695B")
                .style("stroke-width", "2.5");
        }
        const remove = () => {
            element.remove();
            element = null;
        }
        const removePrevious = () => {
            if (previousElement) {
                previousElement.remove();
            }
        }

        const dragStart = (event) => {
            var p = d3.pointer(event, svg.node());
            init(p[0], p[1]);
            removePrevious();
        }
        const dragMove = (event) => {
            var p = d3.pointer(event, svg.node());
            update(p[0], p[1]);
        }

        const dragEnd = (event) => {
            console.log('drag end');
            var finalAttributes = getCurrentAttributes();
            if (finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1) {
                focus();
            } else {
                remove();
            }
            setSelection({ x1: finalAttributes.x1, y1: finalAttributes.y1, x2: finalAttributes.x2, y2: finalAttributes.y2 });
            setRange({
                start: DateTime.fromJSDate(scales.x.invert(finalAttributes.x1)),
                end: DateTime.fromJSDate(scales.x.invert(finalAttributes.x2))
            });

        }
        if (selection != null) {
            init(selection.x1, selection.y1);
            setAttrs(selection.x1, selection.y1, selection.x2 - selection.x1, selection.y2 - selection.y1);
        }
        var dragBehavior = d3.drag()
            .on("drag", dragMove)
            .on("start", dragStart)
            .on("end", dragEnd);


        svg.call(dragBehavior);
    }, [svgRef, scales]);
    return range;
}

interface Scales {
    x: d3.ScaleTime<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
}
const getScales = (lines: Line[], height: number, width: number): Scales | null => {

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
}

function calcMinMax(allPoints: Point[]) {
    let yMinValue: number = 0;
    let yMaxValue: number = 0;
    let xMinValue: Date = new Date(0);
    let xMaxValue: Date = new Date(0);
    if (allPoints.length > 0) {
        yMinValue = d3.min(allPoints, (d: Point) => d[1]) as number;
        yMaxValue = d3.max(allPoints, (d: Point) => d[1]) as number;

        xMinValue = allPoints.reduce((a, b) => a[0] < b[0] ? a : b)[0];
        xMaxValue = allPoints.reduce((a, b) => a[0] > b[0] ? a : b)[0];
    }
    return { xMinValue, xMaxValue, yMaxValue };
}

const useDrawAxis = (xText: string, yText: string, svgRef: Svg, scales: Scales, height: number, width: number, margin) => {
    useEffect(() => {

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
    }, [scales])
}

const useDrawLabels = (svgRef: Svg, scales: Scales, height: number) => {
    const ray = [
        { start: DateTime.local(2020, 1, 1, 0, 0, 0), end: DateTime.local(2020, 1, 1, 0, 0, 10), color: 'red' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 5), end: DateTime.local(2020, 1, 1, 0, 0, 9), color: 'blue' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 15), end: DateTime.local(2020, 1, 1, 0, 0, 21), color: 'green' },
        { start: DateTime.local(2020, 1, 1, 0, 0, 17), end: DateTime.local(2020, 1, 1, 0, 0, 40), color: 'yellow' },
        
    ];
    useEffect(() => {
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
    }, [scales, height, ray]);

}