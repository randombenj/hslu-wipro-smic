
import LineChart, { Line } from "./lineChart";
import Paper from '@mui/material/Paper';
import { mapMeasurementsToVoltageLines } from "../../VoltageData";
import { Measurement } from "../../model/measurement";


interface porps {
    measurements: Measurement[]
}

const VoltageGraph = (props: porps) => {
    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = 500;
    const height = width;
    const lines = mapMeasurementsToVoltageLines(props.measurements);
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
                lines={lines}
                strokeWidth={4}
            ></LineChart>
        </Paper>
    )
}
export default VoltageGraph;