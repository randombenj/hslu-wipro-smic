
import LineChart from "./lineChart";
import Paper from '@mui/material/Paper';
import { mapMeasurementsToPowerLine } from '../../model/PowerData'
import { Measurement } from "../../model/Measurement";


interface porps {
    measurements: Measurement[]
}

const PowerGraph = (props: porps) => {
    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = 500;
    const height = width;
    const lines = [mapMeasurementsToPowerLine(props.measurements)];
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
                    yLabel: 'Power',
                }}
                lines={lines}
                strokeWidth={4}
            ></LineChart>
        </Paper>
    )
}
export default PowerGraph;