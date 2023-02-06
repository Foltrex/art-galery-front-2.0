import { Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { Form, Formik } from "formik";
import * as yup from "yup";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import { AccountEnum } from "../../../../entities/enums/AccountEnum";
import RegisterFormBottom from './RegisterFormBottom';
import { useNavigate } from "react-router-dom";
import { useRegister } from '../../../../api/AuthApi';
import { AuthService } from "../../../../services/AuthService";
import { useRootStore } from "../../../../stores/provider/RootStoreProvider";

const RegisterForm = () => {

    const { alertStore } = useRootStore();
    const navigate = useNavigate();

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
        { label: "Organization", value: AccountEnum.REPRESENTATIVE },
        { label: "Artist", value: AccountEnum.ARTIST },
    ];

    const mutationRegister = useRegister();

    const submit = async (email: string, password: string, accountType: string) => {
        alertStore.setShow(false)
        try {
            const registeringRequestDto = {
                email: email,
                password: password,
                accountType: accountType
            }

            const response = await mutationRegister.mutateAsync(registeringRequestDto)
            AuthService.setToken(response.data.token);
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
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                await submit(values.email, values.password, values.accountType)
                setSubmitting(false)
            }}
        >
            {formik => (
                <Form noValidate>
                    <AlertNotification />
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
                            <FormHelperText style={{ color: "red" }}>{formik.errors.accountType}</FormHelperText>}
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
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {formik.isSubmitting ? <CircularProgress /> : "Sign Up"}
                    </Button>
                    <RegisterFormBottom />
                </Form>
            )}
        </Formik>
    )

};

export default RegisterForm;
