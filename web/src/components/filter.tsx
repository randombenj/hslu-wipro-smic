import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSelectMeter from './selectMeter';

interface FilterData {
    meterId: number;
    data: string;
}

function useFilter(): [FilterData, JSX.Element] {
    const [value, setValue] = React.useState("voltage");
    const [meterId, selectMeter] = useSelectMeter();
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
    </Box>;
    return [{ meterId: meterId, data: value }, input];
}

export default useFilter;