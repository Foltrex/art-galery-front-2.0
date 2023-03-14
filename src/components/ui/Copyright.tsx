import {Typography} from "@mui/material";
import React from "react";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}Art Gallery,{' '}{new Date().getFullYear()}{'.'}
        </Typography>
    );
}

export default Copyright
