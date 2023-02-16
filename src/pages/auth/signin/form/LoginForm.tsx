import React from 'react';
import {Form, Formik} from "formik";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import * as yup from "yup";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import LoginFormBottom from "./LoginFormBottom";
import {useRootStore} from "../../../../stores/provider/RootStoreProvider";
import {useNavigate} from "react-router-dom";
import {AuthService} from '../../../../services/AuthService';
import {useLogin} from '../../../../api/AuthApi';
import PasswordTextField from "../../../../components/form/PasswordTextField";

interface ILoginFormValues {
    email: string,
    password: string,
}

const LoginForm = () => {
    const {alertStore} = useRootStore();
    const navigate = useNavigate();
    const mutationLogin = useLogin();

    const initialValues: ILoginFormValues = {
        email: '',
        password: ''
    }

    const validationSchema = yup.object().shape({
        email: yup.string()
            .required()
            .min(3)
            .email(),
        password: yup.string()
            .required()
            .min(6)
    })


    const submit = async (values: ILoginFormValues) => {
        try {
            const response = await mutationLogin.mutateAsync(values);
            AuthService.setToken(response.data.token);
            alertStore.setShow(false)
            navigate('/');
        } catch (error: any) {
            console.log(error.response.data.message)
            alertStore.setShow(true, "error", "Login error", error.response.data.message)
        }
    }

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true)
                await submit(values)
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
                        name={"email"}
                        defaultValue={formik.values.email}
                        onChange={formik.handleChange}
                        error={!!formik.errors.email} helperText={formik.errors.email}
                    />
                    <PasswordTextField
                        id={"password"}
                        label={"Password"}
                        name={"password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.errors.password}
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
                        {formik.isSubmitting ? <CircularProgress size={24}/> : "Sign In"}
                    </Button>
                    <LoginFormBottom/>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm;
