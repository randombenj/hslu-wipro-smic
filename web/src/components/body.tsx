import VoltageGraph from './charts/voltageGraph';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useFilter from './filter';
import { useGetMeasurements } from '../hooks/meters'
import { mapMeasurementsToVoltageLines } from "../VoltageData";

const Body = () => {
  const [meterId, filter] = useFilter();

  let {
    loading,
    error,
    data,
  } = useGetMeasurements(meterId.meterId);
  if (!data) {
    data = [];
  }
  const voltageGraph = <VoltageGraph measurements={data}></VoltageGraph>

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