import {Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {Form, Formik} from "formik";
import * as yup from "yup";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import {AccountEnum} from "../../../../entities/enums/AccountEnum";
import RegisterFormBottom from './RegisterFormBottom';
import {useNavigate} from "react-router-dom";
import {useRegister} from '../../../../api/AuthApi';
import {AuthService} from "../../../../services/AuthService";
import {useRootStore} from "../../../../stores/provider/RootStoreProvider";
import PasswordTextField from "../../../../components/form/PasswordTextField";
import React from "react";

interface IRegisterFormValues {
    email: string,
    password: string,
    accountType: AccountEnum | string,
}

const RegisterForm = () => {
    const {alertStore} = useRootStore();
    const navigate = useNavigate();
    const mutationRegister = useRegister();

    const initialValues: IRegisterFormValues = {
        email: '',
        password: '',
        accountType: AccountEnum.REPRESENTATIVE
    }

    const validationSchema = yup.object().shape({
        email: yup.string()
            .required()
            .min(3)
            .email(),
        password: yup.string()
            .required()
            .min(6),
        accountType: yup.string()
            .required('account type is a required field')
    })

    const options = [
        {label: "Organization", value: AccountEnum.REPRESENTATIVE},
        {label: "Artist", value: AccountEnum.ARTIST},
    ];

    const submit = async (values: IRegisterFormValues) => {
        try {
            const response = await mutationRegister.mutateAsync(values)
            AuthService.setToken(response.data.token);
            alertStore.setShow(false)
            navigate('/')
        } catch (error: any) {
            console.log(error.response.data.message)
            alertStore.setShow(true, 'error', "Register error", error.response.data.message);
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                        <Stack direction="row" spacing={2}>
                            {
                                options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        label={option.label}
                                        control={
                                            <Checkbox
                                                value={option.value}
                                                checked={formik.values.accountType == option.value}
                                                onChange={(event) => {
                                                    formik.setFieldValue('accountType', event.target.value)
                                                }}
                                            />
                                        }
                                    />
                                ))
                            }
                        </Stack>
                        {formik.errors.accountType &&
                            <FormHelperText style={{color: "red"}}>{formik.errors.accountType}</FormHelperText>}
                    </Box>
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={formik.isSubmitting}
                        sx={{mt: 3, mb: 2}}
                    >
                        {formik.isSubmitting ? <CircularProgress size={24}/> : "Sign Up"}
                    </Button>
                    <RegisterFormBottom/>
                </Form>
            )}
        </Formik>
    )

};

export default RegisterForm;
