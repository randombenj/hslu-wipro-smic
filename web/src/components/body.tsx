import VoltageGraph from './voltageGraph';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useFilter from './filter';
import { useGetMeasurements } from '../hooks/meters'
import useWindowDimensions from "../hooks/windowDimensions";
import { useEffect, useState } from "react";
import { Data } from "../data";

const Body = () => {
  const [meterId, filter] = useFilter();

  let {
    loading,
    error,
    data,
  } = useGetMeasurements(meterId.meterId);
  let points = new Data([]);
  if (data) {
    points = new Data(data);
  }
  const voltageGraph = <VoltageGraph dataPoints={points}></VoltageGraph>

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
        <Grid item xs={12}>
          {voltageGraph}
        </Grid>
      </Grid>
    </div>
  </Box >
}
export default Body