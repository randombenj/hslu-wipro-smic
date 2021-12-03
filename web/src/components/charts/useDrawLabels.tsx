import * as d3 from 'd3';
import { useEffect } from "react";
import { Svg } from './SMICChart';
import { Scales } from "./Scales";
import { LabelAssignment } from '../../hooks/labels';
import { DateTime } from 'luxon';


export const useDrawLabels = (svgRef: Svg, scales: Scales | null, height: number, labels: LabelAssignment[]) => {

    useEffect(() => {
        if (scales) {
            console.log(labels)
            const svg = d3.select(svgRef.current).select('g');
            console.log('draw labels');
            labels.forEach(label => {
                svg.append('rect')
                    .attr('x', scales.x(DateTime.fromISO(label.start_time)))
                    .attr('y', 0)
                    .attr('width', scales.x(DateTime.fromISO(label.end_time)) - scales.x(DateTime.fromISO(label.start_time)))
                    .attr('height', height)
                    .attr('fill', "red")
                    
                    .attr('opacity', 0.5);
            });
        }
    }, [scales, height, labels]);

};
