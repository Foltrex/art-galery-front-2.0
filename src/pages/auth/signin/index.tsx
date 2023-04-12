import * as React from 'react';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import LoginForm from "./form/LoginForm";
import Copyright from "../../../components/ui/Copyright";

interface ILoginProps {
}

const Login: React.FunctionComponent<ILoginProps> = () => {
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
                <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}><LockOutlinedIcon/></Avatar>
                <Typography component="h1" variant="h5">Sign in</Typography>
                <LoginForm/>
            </Box>
            <Copyright sx={{mt: 4, mb: 4}}/>
        </Container>
    );
};

export default Login;
