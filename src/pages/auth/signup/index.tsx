import * as React from 'react';
import Container from "@mui/material/Container";
import {Avatar, CssBaseline, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Copyright from "../../../components/ui/Copyright";
import RegisterForm from "./form/RegisterForm";

interface IRegisterProps {
}

export const Register: React.FunctionComponent<IRegisterProps> = () => {

    return (
        // <ThemeProvider theme={theme}>
        <Container component='main' maxWidth='xs'>
            <CssBaseline/>
            <Box sx={boxStyle}>
                <Avatar sx={avatarStyle}/>
                <Typography component="h1" style={{marginBottom: '20px'}} variant="h5">Sign up</Typography>
                <RegisterForm/>
            </Box>
            <Copyright sx={{mt: 4}}/>
        </Container>
        // </ThemeProvider>
    );

};

export default Register;

const boxStyle = {
    marginTop: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}

const avatarStyle = {
    m: 1,
    bgcolor: 'secondary.main'
}
