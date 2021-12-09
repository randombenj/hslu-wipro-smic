import { FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from "@mui/material"


interface props {
    setLabelMode: (mode: string) => void;
    labelMode: string;
}

export const SwitchLabelMode = (props: props) => {
    return (
        <Paper style={{width: 200, padding:5}}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Label mode</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    value={props.labelMode}
                    onChange={(event, value) => {
                        props.setLabelMode(value);
                    }
                    }
                >
                    <FormControlLabel value="add_label" control={<Radio />} label="New" />
                    <FormControlLabel value="view_label" control={<Radio />} label="View" />
                </RadioGroup>
            </FormControl>
        </Paper>
    )
}