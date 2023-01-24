import React from 'react';
import {Form, Formik} from "formik";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import * as yup from "yup";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import LoginFormBottom from "./LoginFormBottom";
import {useRootStore} from "../../../../stores/provider/RootStoreProvider";
import {useNavigate} from "react-router-dom";
import { AuthService } from '../../../../services/AuthService';
import { useCookies } from 'react-cookie';
import { AuthApi } from '../../../../api/AuthApi';

const LoginForm = () => {
    const [cookies, setCookie] = useCookies(['token']);

    const {alertStore} = useRootStore();
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email cannot be empty').min(1).email("Email not valid"),
        password: yup.string().required('Password cannot be empty').min(1)
    })

    const submit = async (email: string, password: string) => {
        await AuthApi.login(email, password)
            .then(response => {
                AuthService.setToken(response.data.token)
                navigate("/")
            })
            .catch(error => {
                console.log(error.response.data.message)
                alertStore.setShow(true, "error", "Login error", error.response.data.message)
            })
    }

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                setCookie('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE2NzQ3NDA1NzZ9.6inUnNgIeS92ztiedemri7fdBilHhhyi2pfEZBreOlU')
                navigate('/');


                setSubmitting(true)
                await submit(values.email, values.password)
                setSubmitting(false)
            }}
        >
            {formik => (
                <Form noValidate>
                    <AlertNotification/>
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
                    <LoginFormBottom/>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm;