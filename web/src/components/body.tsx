import VoltageGraph from './charts/voltageGraph';
import PowerGraph from './charts/powerGraph';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useFilter from './filter';
import IconButton from '@mui/material/IconButton';
import Refresh from '@mui/icons-material/Refresh';
import { useGetMeasurements } from '../hooks/meters'
import { useState, useEffect, useMemo } from 'react';
import useInterval from '../hooks/interval'
import Stack from '@mui/material/Stack';
import Labels from './labels';
import NewChart from './charts/newChart';

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
const useGetGraphsStack = (filterData, data) => {
  const graphs = [];
  useMemo(() => {
    if (filterData.selectedMeasurements.includes('Voltage')) {
      graphs.push(wrapGraph(<VoltageGraph measurements={data}></ VoltageGraph>));
    }
    if (filterData.selectedMeasurements.includes('Power')) {
      graphs.push(wrapGraph(<PowerGraph measurements={data}></PowerGraph>));
    }
    if (filterData.selectedMeasurements.includes('THD')) {
      graphs.push(wrapGraph(<NewChart measurements={data}></ NewChart>));
    }
  }, [filterData, data]);

  return <Stack direction="row" >
    {graphs}
  </Stack>
}

