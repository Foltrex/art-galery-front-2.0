import Alert from '@mui/material/Alert';
import {AlertColor} from "@mui/material/Alert/Alert";

export enum ThreadStatus {
    in_process = 'in_process', open = 'open', done = 'done'
}

export function ThreadStatusComponent({status}:{status:ThreadStatus}) {
    let label, color:AlertColor;
    switch (status) {
        case 'in_process':
            label = 'IN PROCESS';
            color = 'warning';
            break;
        case 'open':
            label = 'OPEN';
            color = "error";
            break;
        case 'done':
            label = 'DONE';
            color = "success";
            break;
        default:
            label = 'UNKNOWN';
            color = 'error';
    }
    return <Alert classes={{message: 'inline-alert'}} style={{padding: 0, display: "inline-block"}} icon={false} color={color}>{label}</Alert>
}