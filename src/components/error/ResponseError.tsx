import {Typography} from "@mui/material";
import {Box} from "@mui/system";
import Bubble from "../bubble/Bubble";
import React from "react";

export function getErrorMessage(message: string, error: any) {
    return Bubble.error({
        noIcon: true,
        //@ts-ignore
        message: <ResponseError e={error}>
            {message}</ResponseError>,
        duration: 999999
    })
}

export function ResponseError (props:{children: any, e: any }) {


        const e = props.e || {};
        const data = e.response?.data || {};
        const error = data.error;
        const status = data.status;
        const message = e.response?.data?.message || e.message || '[no error message]';
        const errors = e.response?.data?.errors ?? '';

        return <Box>
            <Typography>
                {props.children}
            </Typography>
            {props.e !== null && <Typography>Status:&nbsp;{[status, error].filter(v => v).join(", ")}</Typography>}
            {props.e !== null && !!message && <Typography>
                {message}
            </Typography>}
            {props.e !== null && !!errors && <Typography>
                {errors}
            </Typography>}
        </Box>

}