import React, {useState} from 'react';
import {Form, Formik} from "formik";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import * as yup from "yup";
import LoginFormBottom from "./LoginFormBottom";
import {useNavigate} from "react-router-dom";
import {AuthService} from '../../../../services/AuthService';
import {useLogin} from '../../../../api/AuthApi';
import PasswordTextField from "../../../../components/form/PasswordTextField";
import {getErrorMessage} from "../../../../components/error/ResponseError";
import {useQueryClient} from "react-query";

interface ILoginFormValues {
    email: string,
    password: string,
}

const LoginForm = () => {
    const navigate = useNavigate();
    const mutationLogin = useLogin((error) => {
        if(error.response?.status === 401 || error.response?.status === 404) {
            getErrorMessage("Invalid credentials", null);
        } else {
            getErrorMessage("Failed to perform login action. Most probably service unavailable or in maintenance." +
                " Please try again after couple minutes", error);
        }
    });
    const [rememberMe, setRememberMe] = useState<boolean>(true)
    const queryClient = useQueryClient();

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
        const response = await mutationLogin.mutateAsync(values);
        await queryClient.invalidateQueries();
        AuthService.setToken(response.data.token);
        AuthService.setRememberMe(rememberMe)
        navigate('/');
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
                        control={
                            <Checkbox
                                color="primary"
                                value={rememberMe}
                                onChange={(event) => {
                                    setRememberMe(event.target.checked)
                                }}
                                checked={rememberMe}
                            />
                        }
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
