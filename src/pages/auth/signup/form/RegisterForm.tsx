import React from 'react';
import {Form, Formik} from "formik";
import Box from "@mui/material/Box";
import {Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Stack, TextField} from "@mui/material";
import {AccountEnum} from "../../../../entities/enums/AccountEnum";
import * as yup from "yup";
import RegisterFormBottom from './RegisterFormBottom';
import AlertNotification from '../../../../components/notifications/AlertNotification';

const RegisterForm = () => {

    const initialValues = {
        email: '',
        password: '',
        accountType: AccountEnum.REPRESENTATIVE
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email cannot be empty').min(1).email("Email not valid"),
        password: yup.string().required('Password cannot be empty').min(6),
        accountType: yup.string().required('Account type cannot be empty')
    })

    const options = [
        {label: "Organization", value: AccountEnum.REPRESENTATIVE},
        {label: "Artist", value: AccountEnum.ARTIST},
    ];

    return (
        <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true)
                // await AuthService.register(values.email, values.password, values.accountType)
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={formik.isSubmitting}
                        sx={{mt: 3, mb: 2}}
                    >
                        {formik.isSubmitting ? <CircularProgress/> : "Sign Up"}
                    </Button>
                    <RegisterFormBottom/>
                </Form>
            )}
        </Formik>
    )

};

export default RegisterForm;