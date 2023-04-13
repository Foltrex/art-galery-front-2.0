import React, {useState} from 'react';
import {Form, Formik} from "formik";
import {Button, Checkbox, CircularProgress, FormControlLabel, TextField} from "@mui/material";
import * as yup from "yup";
import LoginFormBottom from "./LoginFormBottom";
import {useNavigate} from "react-router-dom";
import {AuthService} from '../../../../services/AuthService';
import {useLogin} from '../../../../api/AuthApi';
import PasswordTextField from "../../../../components/form/PasswordTextField";
import Bubble from "../../../../components/bubble/Bubble";
import {getErrorMessage} from "../../../../util/PrepareDataUtil";

interface ILoginFormValues {
    email: string,
    password: string,
}

const LoginForm = () => {
    const navigate = useNavigate();
    const mutationLogin = useLogin();
    const [rememberMe, setRememberMe] = useState<boolean>(true)

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
            AuthService.setRememberMe(rememberMe)
            navigate('/');
        } catch (error: any) {
            console.log(getErrorMessage(error))
            Bubble.error({message: "Login error. Error message: " + getErrorMessage(error), duration: 999999})
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
