import * as React from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSelectMeter from './selectMeter';
import useSelectMeasurements from './selectMeasurement';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import { DateTime } from 'luxon';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Paper, Grid } from '@mui/material';

interface FilterData {
    meterId: number;
    selectedMeasurements: string[];
    startDate: DateTime | null;
    endDate: DateTime | null;
}

function useFilter(initialStartDate: DateTime | null = null, initialEndDate: DateTime | null = null, refetchIndex: number): [FilterData, JSX.Element] {

    const [selectedMeasurements, selectMeasurementsUi] = useSelectMeasurements();
    const [meterId, selectMeter] = useSelectMeter(refetchIndex);
    
    const [startDate, setStartDate] = React.useState<DateTime | null>(initialStartDate);
    const [endDate, setEndDate] = React.useState<DateTime | null>(initialEndDate);


    const input =
        <Paper elevation={3} style={{ padding: 10 }}>
            <Grid container>
                <Grid item>
                    {selectMeasurementsUi}
                </Grid>
                <Grid item>
                    {selectMeter}
                </Grid>
                <div style={{ margin: "10px" }}>

                    <DatePicker
                        label="Period start"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
                <div style={{ margin: "10px" }}>

                    <DatePicker
                        label="Period end"
                        value={endDate}
                        onChange={(newValue) => {
                            setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
            </Grid>
        </Paper>;
    return [{ meterId, selectedMeasurements, startDate, endDate }, input];
}

export default useFilter;