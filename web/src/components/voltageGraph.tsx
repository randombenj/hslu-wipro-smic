import useFetch from "use-http";
import { Data } from "../data";
import LineChart from "./lineChart";
import {useGetMeasurements} from '../hooks/meters'
const VoltageGraph = () => {
    const {
        loading,
        error,
        data,
    } = useGetMeasurements(1);

    if (loading) return <p>Loading...</p>;
    else
        if (error) return <p>Error: {error.message}</p>;
        else {
            const ddata = new Data(data);
            console.log(ddata);
            return (
                <LineChart
                    svgProps={{
                        margin: { top: 80, bottom: 80, left: 80, right: 80 },
                        width: 400,
                        height: 400,
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
}

export default VoltageGraph;