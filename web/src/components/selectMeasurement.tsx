import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const useSelectMeasurements = (): [string[], JSX.Element] => {

    const MEASUREMENTS: string[] = ['Voltage', 'Power', 'THD'];
    const [selectedMeasurements, setSelectedMeasurements] = React.useState<string[]>(MEASUREMENTS);

    const measurementSelectionChanged = (measurement: string, value: boolean) => {
        if (value) {
            if (!selectedMeasurements.includes(measurement)) {
                setSelectedMeasurements([...selectedMeasurements, measurement]);
            }
        } else {
            if (selectedMeasurements.includes(measurement)) {
                const m = selectedMeasurements;
                m.splice(m.indexOf(measurement), 1);
                setSelectedMeasurements(m);
            }
        }
    };
    const checkboxes = MEASUREMENTS.map(measurement => {
        return <FormControlLabel control={<Checkbox defaultChecked onChange={v => measurementSelectionChanged(measurement, v.target.checked)} />} label={measurement} />
    });
    return [selectedMeasurements, <FormGroup>
        {checkboxes}
    </FormGroup>];
}

export default useSelectMeasurements;