import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {observer} from "mobx-react-lite";
import {Form, Formik} from 'formik';
import * as yup from "yup";
import {Button, Checkbox, CircularProgress, FormControlLabel, Grid, TextField} from '@mui/material';
import Copyright from "../../components/ui/Copyright";

const theme = createTheme();

const SignIn = observer(() => {

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email cannot be empty').min(1).email("Email not valid"),
        password: yup.string().required('Password cannot be empty').min(1)
    })

    const SignInForm = () => {
        return (
            <Formik
                validateOnChange={false}
                validateOnBlur={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    setSubmitting(true)
                    // await AuthService.login(values.email, values.password)
                    setSubmitting(false)
                }}
            >
                {formik => (
                    <Form noValidate>
                        {/*<AlertNotification/>*/}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            defaultValue={formik.values.email}
                            onChange={(event) => {
                                formik.setFieldValue('email', event.target.value)
                            }}
                            error={!!formik.errors.email} helperText={formik.errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            defaultValue={formik.values.password}
                            onChange={(event) => {
                                formik.setFieldValue('password', event.target.value)
                            }}
                            error={!!formik.errors.password} helperText={formik.errors.password}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={formik.isSubmitting}
                            sx={{mt: 3, mb: 2}}
                        >
                            {formik.isSubmitting ? <CircularProgress/> : "Sign In"}
                        </Button>
                        <Grid container>
                            {/*<Grid item xs>*/}
                            {/*    <Link className={"my-link"} href={"/auth/passwordrecovery"}>*/}
                            {/*        Forgot password?*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                            {/*<Grid item>*/}
                            {/*    <Link className={"my-link"} href={"/auth/signup"}>*/}
                            {/*        {"Don't have an account? Sign Up"}*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Form>
                )}
            </Formik>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}><LockOutlinedIcon/></Avatar>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    <SignInForm/>
                </Box>
                <Copyright sx={{mt: 4, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
})

export default SignIn