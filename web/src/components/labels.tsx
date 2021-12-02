import Paper from '@mui/material/Paper';
import { useGetLabels, useGetLabelAssignments, useAddLabelAssignment } from '../hooks/labels';
import { FilterData } from './filter';
import { Grid, Button } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { DateTime } from 'luxon';
import useFetch from "use-http";
import formatDate from "../hooks/utils";

const Labels = (filterData: FilterData) => {
    const labels = useGetLabels().data;
    let labelElements = labels?.map(label => <div>{label.name}</div>)
    // let {addLabel} = useAddLabelAssignment();
    let labelAssignments = useGetLabelAssignments(filterData.meterId).data;
    let assignments: Array<JSX.Element> = [];
    if (labelAssignments) {
        assignments = labelAssignments.map(assignment => <li><p>"{assignment.name}" from {assignment.start_time} to {assignment.end_time}</p></li>)
    }

    const { post } = useFetch('meters', { method: "POST" })

    const addLabel = async () => {
        const data = {
            label_id: 1,
            start_date: formatDate(DateTime.now()),
            end_date: formatDate(DateTime.now()),
        };
        await post('/1/labels', data);
    }

    return (
        <Paper elevation={3} style={{ padding: 5 }}>
            <Grid container>
                <Grid item>
                    <h2>Labels</h2>
                    {
                        labelElements
                    }
                </Grid>
                <Grid item>
                    <ul>
                        {assignments}
                    </ul>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={addLabel} endIcon={<AddCircleIcon />}>Add</Button>
                </Grid>
            </Grid>
        </Paper>
    );

}

export default Labels;