import { RemoveCircle } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import useFetch from "use-http";
import { LabelAssignment } from "../hooks/labels";


interface props {
    label: LabelAssignment | null;
    refetch: any;
}

export const LabelDetails = (props: props) => {
    const label = props.label;
    const labelSelected = label !== null;

    const fetch= useFetch('labels/assignments', { method: "DELETE" })
    const removeLabel = async () => {
        if (labelSelected) {
            await fetch.delete(`/${label.id}`);
            props.refetch();
        }
    }

    return (
        <Paper elevation={3} style={{ padding: 5, width: 500 }} >
            {labelSelected && <div>
                <h3>Details of the selected label</h3>
                <p>{label.name}</p>
                <p>{label.start_time}</p>
                <Button variant="contained" onClick={removeLabel} endIcon={<RemoveCircle />}>Remove Label</Button>
            </div>

            }
            {
                !labelSelected &&
                <p>Click on a label in the chart above to view its details!</p>
            }
        </Paper >

    )
}

