import Paper from '@mui/material/Paper';
import { useGetLabels, useGetLabelAssignments } from '../hooks/labels';
import { FilterData } from './filter';
import { Grid, Button, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useFetch from "use-http";
import formatDate from "../hooks/utils";
import { SelectedRange } from './charts/SelectedRange';
import { useState } from 'react';

const Labels = (filterData: FilterData, selectedRange: SelectedRange, refetch: any) => {
    const labels = useGetLabels().data;
    let labelElements = labels?.map(label => <div>{label.name}</div>)
    let labelAssignments = useGetLabelAssignments(filterData.meterId).data;
    let assignments: Array<JSX.Element> = [];
    if (labelAssignments) {
        assignments = labelAssignments.map(assignment => <li><p>"{assignment.name}" from {assignment.start_time} to {assignment.end_time}</p></li>)
    }

    const { post } = useFetch('meters', { method: "POST" })
    const [selectedLabel, setSelectedLabel] = useState(1);
    const addLabel = async () => {
        const data = {
            label_id: selectedLabel,
            start_time: formatDate(selectedRange.start) + "Z",
            end_time: formatDate(selectedRange.end) + "Z",
        };
        await post(`/${filterData.meterId}/labels`, data);
        refetch();
    }
    let menuItems: JSX.Element[] = [];
    if (labels) {
        menuItems = labels.map(label => <MenuItem key={label.id} value={label.id}>{label.name}</MenuItem>);
    }

    const format = "hh:mm:ss dd.MM.yyyy";
    return (
        <Paper elevation={3} style={{ padding: 5, width: 500 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <h3>New Label</h3>
                        <p>{selectedRange.start.toFormat(format)}</p>
                        <p> to </p>
                        <p>{selectedRange.end.toFormat(format)}</p>
                    </Grid>

                    <Grid item>
                        <FormControl style={{ width: "200px", margin: "10px" }}>
                            <InputLabel id="select-label-label">Label</InputLabel>
                            <Select
                                labelId="select-label-label"
                                id="select-meter"
                                value={selectedLabel}
                                label="Label"
                                onChange={e =>
                                    setSelectedLabel((e.target.value as any))
                                }
                            >
                                {
                                    menuItems
                                }
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={addLabel} endIcon={<AddCircleIcon />} style={{verticalAlign:"middle"}}>Add</Button>

                    </Grid>
                </Grid>
        </Paper>
    );

}

export default Labels;