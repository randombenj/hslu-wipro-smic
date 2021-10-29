import './App.css';

import { CachePolicies, Provider } from "use-http";
import VoltageGraph from './components/voltageGraph';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
function App() {

  return (
    <Provider url="http://localhost:8888/api/" options={{ cacheLife: 0, cachePolicy: CachePolicies.NO_CACHE }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Meter into the Cloud!
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12} style={{height: "500px"}}>
            <VoltageGraph></VoltageGraph>
          </Grid>
        </Grid>

      </Box >
    </Provider>
  );


}

export default App;
