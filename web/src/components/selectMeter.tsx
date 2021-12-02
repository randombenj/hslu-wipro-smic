import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGetMeters } from '../hooks/meters';
import { useQueryParam, withDefault, NumberParam } from 'use-query-params';


function useSelectMeter(refetchIndex: number): [number, JSX.Element] {

    const {
        loading,
        error,
        data
    } = useGetMeters(refetchIndex);
    let menuItems = [<MenuItem value="">No meters fetched</MenuItem>];
    // const [value, setValue] = useQueryParam("meter", withDefault(NumberParam, 1));
    const [value, setValue] = React.useState(1);
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
            onChange={e =>
                setValue((e.target.value as any))
            }
        >
            {
                menuItems
            }
        </Select>
    </FormControl>

    return [value, input];
}

export default useSelectMeter;