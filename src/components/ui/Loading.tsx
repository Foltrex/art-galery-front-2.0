import React from 'react';
import {Box, CircularProgress} from "@mui/material";

const Loading = () => {

    return (
        <Box display="flex" justifyContent="center">
            <CircularProgress/>
        </Box>
    );
};

export default Loading;
