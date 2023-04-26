import React from 'react';
import {Box, CircularProgress} from "@mui/material";

const Loading = ({center}:{center?: true}) => {

    const out = (
        <Box display="flex" justifyContent="center">
            <CircularProgress/>
        </Box>
    );
    if(!center) {
        return out;
    }
    return <Box alignItems={"center"} display={"flex"} height={'100%'} width={'100%'} justifyContent="center">
        {out}
    </Box>
};

export default Loading;
