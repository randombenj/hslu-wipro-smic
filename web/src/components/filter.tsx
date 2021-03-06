import * as React from 'react';
import useSelectMeter from './selectMeter';
import useSelectMeasurements from './selectMeasurement';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import { DateTime } from 'luxon';
import { Paper, Grid } from '@mui/material';

export interface FilterData {
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
                            if (newValue){
                                newValue = newValue.set({hour:0, minute:0, second:0, millisecond:0});
                            }
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
                            if (newValue){
                                newValue = newValue.set({hour:23, minute:59, second:59, millisecond:999});
                            }
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