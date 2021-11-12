import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSelectMeter from './selectMeter';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import {DateTime} from 'luxon';

interface FilterData {
    meterId: number;
    data: string;
    startDate: DateTime | null;
    endDate: DateTime | null;
}

function useFilter(initialStartDate: DateTime | null = null, initialEndDate: DateTime | null = null, refetchIndex:number): [FilterData, JSX.Element] {
    const [value, setValue] = React.useState("voltage");
    const [startDate, setStartDate] = React.useState<DateTime | null>(initialStartDate);
    const [endDate, setEndDate] = React.useState<DateTime | null>(initialEndDate);
    const [meterId, selectMeter] = useSelectMeter(refetchIndex);
    const input = <Box>

        <FormControl style={{ width: "200px", margin: "10px" }}>
            <InputLabel id="demo-simple-select-label">VoltageData</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="VoltageData"
                onChange={e => setValue(e.target.value)}
            >
                <MenuItem value="voltage">Voltage</MenuItem>
                <MenuItem value="power">Power</MenuItem>
                <MenuItem value="thd">THD</MenuItem>
            </Select>
        </FormControl>
        {selectMeter}
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
    </Box>;
    return [{ meterId, data: value, startDate, endDate }, input];
}

export default useFilter;