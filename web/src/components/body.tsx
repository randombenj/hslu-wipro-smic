import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useFilter, { FilterData } from './filter';
import { useGetMeasurements } from '../hooks/meters'
import { useState, useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Labels from './labels';
import NewChart from './charts/newChart';
import { mapMeasurementsToVoltageLines } from '../model/VoltageData';
import { mapMeasurementsToPowerLine } from '../model/PowerData';
import { Line } from '../model/Line';
import { Measurement } from '../model/Measurement';

const Body = () => {
  const [refetchIndex, setRefetchIndex] = useState(0);
  const [filterData, filter] = useFilter(null, null, refetchIndex);

  const refetch = () => {
    setRefetchIndex(refetchIndex + 1);
  }

  let {
    loading,
    error,
    data,
  } = useGetMeasurements(filterData.meterId, filterData.startDate, filterData.endDate, refetchIndex);
  if (!data) {
    data = [];
  }

  let graphs = useGetGraphsStack(filterData, data);



  const labels = Labels(filterData);
  // useInterval(() => {
  //   refetch();
  // }, 1000) // this makes the dragging ugly...
  return <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Smart Meter into the Cloud!
        </Typography>
      </Toolbar>
    </AppBar>
    <div style={{ padding: "10px" }}>
      <Grid container>
        <Grid item>
          {filter}
        </Grid>

        <Grid item xs={12} style={{ marginTop: 5 }}>
          {graphs}
        </Grid>
      </Grid>
      <Grid item style={{ marginTop: 5 }}>
        {labels}
      </Grid>
    </div>
  </Box >
}
export default Body;

const wrapGraph = (graph: JSX.Element) => {
  return <Grid item style={{ marginRight: 5 }}>{graph}</Grid>
}
const useGetGraphsStack = (filterData: FilterData, measurements: Measurement[]): JSX.Element => {
  const graphs: Array<JSX.Element> = [];
  useMemo(() => {
    if (filterData.selectedMeasurements.includes('Voltage')) {
      const voltageLines: Line[] = mapMeasurementsToVoltageLines(measurements);
      graphs.push(wrapGraph(<NewChart lines={voltageLines} yAxisName="Voltage"></ NewChart>));
    }
    if (filterData.selectedMeasurements.includes('Power')) {
      const powerLine: Line = mapMeasurementsToPowerLine(measurements);
      graphs.push(wrapGraph(<NewChart lines={[powerLine]} yAxisName="Power"></ NewChart>));
    }
    if (filterData.selectedMeasurements.includes('THD')) {
      // graphs.push(wrapGraph(<NewChart measurements={data} yAxisName="THD"></ NewChart>));
    }
  }, [filterData, measurements]);

  return <Stack direction="row" >
    {graphs}
  </Stack>
}

