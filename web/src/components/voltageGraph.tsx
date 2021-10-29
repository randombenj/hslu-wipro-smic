import { Data } from "../data";
import LineChart from "./lineChart";
import { useGetMeasurements } from '../hooks/meters'
import useWindowDimensions from "../hooks/windowDimensions";



const VoltageGraph = () => {
    const windowDimensions = useWindowDimensions();

    const top = 80;
    const bottom = 80;
    const left = 60;
    const right = 20;
    const width = windowDimensions.width - left - right;
    const height = width;
    const {
        loading,
        error,
        data,
    } = useGetMeasurements(1);
    if (data) {
        const ddata = new Data(data);
        console.log(ddata);
        return (
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
                data={ddata}
                strokeWidth={4}
            ></LineChart>
        )
    }
    else if (loading) return <p>Loading...</p>;
    else
        if (error) return <p>Error: {error.message}</p>;
        else return <p>No data</p>;

}

export default VoltageGraph;