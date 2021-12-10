import { RemoveCircle } from "@mui/icons-material";
import { Button, Grid, Paper } from "@mui/material";
import { DateTime } from "luxon";
import useFetch from "use-http";
import { LabelAssignment } from "../hooks/labels";


interface props {
    label: LabelAssignment | null;
    refetch: any;
}

export const LabelDetails = (props: props) => {
    const label = props.label;
    const labelSelected = label !== null;

    const fetch = useFetch('labels/assignments', { method: "DELETE" })
    const removeLabel = async () => {
        if (labelSelected) {
            await fetch.delete(`/${label.id}`);
            props.refetch();
        }
    }

    return (
        <Paper elevation={3} style={{ padding: 5, width: 500 }} >


            {labelSelected && <Grid container alignItems="flex-end" justifyContent="space-between">
                <Grid item>

                    <h3>{label.name}</h3>
                    <p>{DateTime.fromISO(label.start_time).toFormat("hh:mm:ss dd.MM.yyyy")}</p>
                    <p>to</p>
                    <p>{DateTime.fromISO(label.end_time).toFormat("hh:mm:ss dd.MM.yyyy")}</p>
                </Grid>
                <Grid item style={{marginBottom: 15, marginRight:15}}>
                    <Button variant="contained" onClick={removeLabel} endIcon={<RemoveCircle />}>Remove Label</Button>
                </Grid>
            </Grid>


            }
            {
                !labelSelected &&
                <p>Click on a label in the chart above to view its details!</p>
            }
        </Paper >

    )
}

