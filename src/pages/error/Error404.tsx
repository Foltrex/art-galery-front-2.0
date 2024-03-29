import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from "react-router-dom";

export default function Error404 ({back}:{back?:string}) {
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
                404
            </Typography>
            <Typography variant="h6">
                The page you’re looking for does not exist.
            </Typography>
            <Button variant={"text"} onClick={() => navigate(back || "/")}>Back</Button>
        </Box>
    );
}