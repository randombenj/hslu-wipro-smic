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
import { useState } from 'react';

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
  let graph: JSX.Element | null = null;
  switch (filterData.data) {
    case ('voltage'):
      graph = <VoltageGraph measurements={data}></VoltageGraph>
      break;
    case ('power'):
      graph = <PowerGraph measurements={data}></PowerGraph>
      break;
  }

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
        <Grid item xs={12}>
          {filter}
        </Grid>
        <IconButton onClick={refetch} >
          <Refresh />
        </IconButton>
        <Grid item xs={12}>
          {graph}
        </Grid>
      </Grid>
    </div>
  </Box >
}
export default Body