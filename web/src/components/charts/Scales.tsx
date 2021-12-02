import * as d3 from 'd3';


export interface Scales {
    x: d3.ScaleTime<number, number, never>;
    y: d3.ScaleLinear<number, number, never>;
}
