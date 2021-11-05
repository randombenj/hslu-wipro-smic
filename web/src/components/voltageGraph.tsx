import { Data } from "../data";
import LineChart from "./lineChart";
import { useGetMeasurements } from '../hooks/meters'
import useWindowDimensions from "../hooks/windowDimensions";
import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
interface Props {
    dataPoints: Data;
}

const VoltageGraph = (props: Props) => {
    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = 500;
    const height = width;

    return (
        <Paper elevation={3} style={{ width: width + left + right }}>
            <LineChart
                svgProps={{
                    margin: { top, bottom, left, right },
                    width,
                    height,
                }}

                axisProps={{
                    xLabel: 'Time',
                    yLabel: 'Voltage',
                }}
                data={props.dataPoints}
                strokeWidth={4}
            ></LineChart>
        </Paper>
    )

}

export default VoltageGraph;