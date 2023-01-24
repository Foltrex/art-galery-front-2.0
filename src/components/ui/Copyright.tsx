import {Typography} from "@mui/material";
import React from "react";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            {/*<Link className={"my-link"} color="inherit" href="/">*/}
                Art Gallery
            {/*</Link>{' '}*/}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright