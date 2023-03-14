import React from 'react';
import Box from "@mui/material/Box";

const Error = (props: { message: string }) => {
    return (
        <Box display="flex" justifyContent="center">Error: {props.message}</Box>
    );
};

export default Error;
