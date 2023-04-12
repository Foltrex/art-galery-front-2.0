import * as React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Copyright from "../../../components/ui/Copyright";
import Container from "@mui/material/Container";
import PasswordRecoveryForm from "./PasswordRecoveryForm";
import KeyIcon from '@mui/icons-material/Key';
import {useLocation} from "react-router-dom";
import EmailSearchForm from "./EmailSearchForm";

interface IPasswordRecoveryProps {
}

const PasswordRecovery: React.FunctionComponent<IPasswordRecoveryProps> = (props) => {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const value = queryParams.get("email")!;
    const emailParam = value !== null ? value : ""

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box sx={{
                marginTop: 14,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}><KeyIcon/></Avatar>
                <Typography component="h1" variant="h5">Password recovery</Typography>
                {emailParam === "" ? <EmailSearchForm/> : <PasswordRecoveryForm/>}
            </Box>
            <Copyright sx={{mt: 4, mb: 4}}/>
        </Container>
    );
};

export default PasswordRecovery;
