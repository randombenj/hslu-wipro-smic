import * as d3 from 'd3';
import { useEffect } from "react";
import { DateTime } from "luxon";
import React from "react";
import { Svg } from './SMICChart';
import { Scales } from "./Scales";
import { SelectedRange } from "./SelectedRange";

export const useSelectRangeWithDrag = (svgRef: Svg, scales: Scales | null): SelectedRange | null => {
    const [range, setRange] = React.useState<SelectedRange | null>(null);
    const [selection, setSelection] = React.useState<any | null>(null);

    useEffect(() => {
        if (scales) {
            const svg = d3.select(svgRef.current).select("g");
            let element: d3.Selection<SVGRectElement, unknown, null, undefined> = null as any;
            let previousElement: d3.Selection<SVGRectElement, unknown, null, undefined> = null as any;
            let currentY = 0;
            let currentX = 0;
            let originX = 0;
            let originY = 0;

            const setElement = (ele: d3.Selection<SVGRectElement, unknown, null, undefined>) => {
                previousElement = element;
                element = ele;
            };


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
            };
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
            };

            const init = (newX: number, newY: number) => {
                var rectElement = svg.append("rect")
                    .attr('rx', 4).attr('ry', 4).attr('opacity', 0.3)
                    .classed("selection", true);
                setElement(rectElement);
                setAttrs(0, 0, 0, 0);
                originX = newX;
                originY = newY;
                update(newX, newY);
            };
            const update = (newX: number, newY: number) => {
                currentX = newX;
                currentY = newY;
                const { x, y, width, height } = getNewAttributes();
                setAttrs(x, y, width, height);
            };

            const setAttrs = (x: number, y: number, width: number, height: number) => {
                element.attr('x', x).attr('y', y).attr('width', width).attr('height', height);
            };
            const focus = () => {
                element.style("stroke", "#DE695B")
                    .style("stroke-width", "2.5");
            };
            const remove = () => {
                element.remove();
                element = null as any;
            };
            const removePrevious = () => {
                if (previousElement) {
                    previousElement.remove();
                }
            };

            const dragStart = (event: DragEvent) => {
                var p = d3.pointer(event, svg.node());
                init(p[0], p[1]);
                removePrevious();
            };
            const dragMove = (event: DragEvent) => {
                var p = d3.pointer(event, svg.node());
                let v0 = p[0];
                let v1 = p[1];
                if (v0 > 500) {
                    v0 = 500;
                }
                if (v0 < 0) {
                    v0 = 0;
                }
                if (v1 > 500) {
                    v1 = 500;
                }
                if (v1 < 0) {
                    v1 = 0;
                }
                update(v0, v1);
            };

            const dragEnd = (event: DragEvent) => {
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

            };
            if (selection != null) {
                init(selection.x1, selection.y1);
                setAttrs(selection.x1, selection.y1, selection.x2 - selection.x1, selection.y2 - selection.y1);
            }
            var dragBehavior: any = d3.drag()
                .on("drag", dragMove)
                .on("start", dragStart)
                .on("end", dragEnd);


            svg.call(dragBehavior);
        }
    }, [svgRef, scales]);
    return range;
};
