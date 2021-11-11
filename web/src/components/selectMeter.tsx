import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useGetMeters } from '../hooks/meters';

function useSelectMeter(): [number, JSX.Element] {
    const {
        loading,
        error,
        data
    } = useGetMeters();
    let menuItems = [<MenuItem value="">No meters fetched</MenuItem>];
    const [value, setValue] = React.useState("1");
    if (data) {
        menuItems = data.map(meter => <MenuItem key={meter.id} value={meter.id}>{meter.serial_number}</MenuItem>);
    }

    let input = <FormControl style={{ width: "200px", margin: "10px" }}>
        <InputLabel id="select-meter-label">Meter</InputLabel>
        <Select
            labelId="select-meter-label"
            id="select-meter"
            value={value}
            label="VoltageData"
            onChange={e => setValue(e.target.value)}
        >
            {
                menuItems
            }
        </Select>
    </FormControl>
    return [parseInt(value), input];
}

export default useSelectMeter;