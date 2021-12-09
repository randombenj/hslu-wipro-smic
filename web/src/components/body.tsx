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
import SMICChart from './charts/SMICChart';
import { mapMeasurementsToVoltageLines } from '../model/VoltageData';
import { mapMeasurementsToPowerLine } from '../model/PowerData';
import { Line } from '../model/Line';
import { Measurement } from '../model/Measurement';
import { SelectedRange, SetRangeType } from './charts/SelectedRange';
import { DateTime } from 'luxon';
import { LabelAssignment, useGetLabelAssignments } from '../hooks/labels';
import { LabelClickedType } from './charts/useDrawLabels';
import { LabelDetails } from './labelDetails';
import { SwitchLabelMode } from './switchLabelMode';
import Refresh from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';

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
  const [selectedRange, setSelectedRange] = useState<SelectedRange>({ start: DateTime.now(), end: DateTime.now() });
  let labelAssignments = useGetLabelAssignments(filterData.meterId, refetchIndex).data;
  if (!labelAssignments) {
    labelAssignments = [];
  }

  const [selectedLabel, setSelectedLabel] = useState<LabelAssignment | null>(null);

  const [labelMode, setLabelMode] = useState<string>("view_label");
  const showAddLabel = labelMode === "add_label";
  let graphs = useGetGraphsStack(filterData, data, setSelectedRange, labelAssignments, setSelectedLabel, labelMode);


  const labels = Labels(filterData, selectedRange, refetch);
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
        <Grid item>
          <IconButton onClick={refetch} >
            <Refresh />
          </IconButton>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 5 }}>
          {graphs}
        </Grid>
        <Grid item style={{ marginTop: 5 }}>
          <SwitchLabelMode labelMode={labelMode} setLabelMode={setLabelMode} ></SwitchLabelMode>
        </Grid>
        {showAddLabel &&
          <Grid item style={{ marginTop: 5, marginLeft: 5 }}>
            {labels}
          </Grid>
        }
        {!showAddLabel &&
          <Grid item style={{ marginTop: 5, marginLeft: 5 }}>
            <LabelDetails label={selectedLabel} refetch={refetch} />
          </Grid>
        }
      </Grid>
    </div>
  </Box >
}
export default Body;

const wrapGraph = (graph: JSX.Element) => {
  return <Grid item style={{ marginRight: 5 }}>{graph}</Grid>
}
const useGetGraphsStack = (filterData: FilterData, measurements: Measurement[], setRange: SetRangeType, labels: LabelAssignment[], onLabelClicked: LabelClickedType, labelMode: string): JSX.Element => {
  const graphs: Array<JSX.Element> = [];
  useMemo(() => {
    if (filterData.selectedMeasurements.includes('Voltage')) {
      const voltageLines: Line[] = mapMeasurementsToVoltageLines(measurements);
      graphs.push(wrapGraph(<SMICChart lines={voltageLines} yAxisName="Voltage" setSelectedRange={setRange} labels={labels} onLabelClicked={onLabelClicked} labelMode={labelMode}></ SMICChart>));
    }
    if (filterData.selectedMeasurements.includes('Power')) {
      const powerLine: Line = mapMeasurementsToPowerLine(measurements);
      graphs.push(wrapGraph(<SMICChart lines={[powerLine]} yAxisName="Power" setSelectedRange={setRange} labels={labels} onLabelClicked={onLabelClicked} labelMode={labelMode}></ SMICChart>));
    }
    if (filterData.selectedMeasurements.includes('THD')) {
      // graphs.push(wrapGraph(<NewChart measurements={data} yAxisName="THD"></ NewChart>));
    }
  }, [filterData, measurements, labels]);

  return <Stack direction="row" >
    {graphs}
  </Stack>
}

