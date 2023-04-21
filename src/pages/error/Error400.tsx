import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";

export default function Error400 ({back}:{back?:string}) {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: '100vh'
            }}
        >
            <Typography variant="h1">
                400
            </Typography>
            <Typography variant="h6">
                Request you sent could not be fulfilled. Most probably, something wrong with URL parameters.
            </Typography>
            <Button variant={"text"} onClick={() => navigate(back || "/")}>Back</Button>
        </Box>
    );
}