import {
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormHelperText,
    Grid,
    Stack,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {useCookies} from 'react-cookie';
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import { useRegister } from '../../../../api/AuthApi';
import PasswordTextField from "../../../../components/form/PasswordTextField";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import { AccountEnum } from "../../../../entities/enums/AccountEnum";
import { AuthService } from "../../../../services/AuthService";
import { useRootStore } from "../../../../stores/provider/RootStoreProvider";
import RegisterFormBottom from './RegisterFormBottom';

interface IRegisterFormValues {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    accountType: AccountEnum | string,
    metadata: string[],
}

const buttonStyle = {
    paddingTop: "15px",
    paddingBottom: "15px",
}

const RegisterForm = () => {
    const {alertStore} = useRootStore();
    const navigate = useNavigate();
    const mutationRegister = useRegister();

    const [cookies, setCookie] = useCookies(['token']);
    const [step, setStep] = useState(1);

    const initialValues: IRegisterFormValues = {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        accountType: '',
        metadata: [],
    }

    const validationSchema = yup.object().shape({
        email: yup.string()
            .required()
            .min(3)
            .email(),
        password: yup.string()
            .required()
            .min(6),
        firstname: yup.string()
            .required()
            .min(2),
        lastname: yup.string()
            .min(2),
        accountType: yup.string()
            .required('account type is a required field')
    })

    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        }
    })


    const submit = async (values: IRegisterFormValues) => {
        try {
            const response = await mutationRegister.mutateAsync(values)
            AuthService.setToken(response.data.token);
            alertStore.setShow(false)
            navigate('/');
        } catch (error: any) {
            console.log(error.response.data.message)
            alertStore.setShow(true, 'error', "Registration error", error.response.data.message);
        }
    }

    const SwitchAccountTypeForm = () => {
        return (
            <>
                <Grid container spacing={5} rowSpacing={1} minWidth={"40vw"}>
                    <Grid item lg={6} xs={12}>
                        <Button
                            size={"large"}
                            fullWidth
                            variant="contained"
                            style={buttonStyle}
                            onClick={() => {
                                formik.setFieldValue('accountType', AccountEnum.REPRESENTATIVE)
                                setStep(2)
                            }}
                        >
                            I'm Organization
                        </Button>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Button
                            size={"large"}
                            fullWidth
                            variant="contained"
                            style={buttonStyle}
                            onClick={() => {
                                formik.setFieldValue('accountType', AccountEnum.ARTIST)
                                setStep(2)
                            }}
                        >
                            I'm Artist
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }

    const InputDataForm = () => {
        return (
            <>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    name={"email"}
                    required
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
                <TextField
                    margin="normal"
                    fullWidth
                    label="Firstname"
                    name={"firstname"}
                    required
                    defaultValue={formik.values.firstname}
                    onChange={formik.handleChange}
                    error={!!formik.errors.firstname} helperText={formik.errors.firstname}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Lastname"
                    name={"lastname"}
                    defaultValue={formik.values.lastname}
                    onChange={formik.handleChange}
                    error={!!formik.errors.lastname} helperText={formik.errors.lastname}
                />
                <Grid container spacing={1} rowSpacing={1} style={{marginTop: "10px"}}>
                    <Grid item lg={6} xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => setStep(1)}
                            disabled={formik.isSubmitting}
                        >
                            Back
                        </Button>
                    </Grid>
                    <Grid item lg={6} xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? <CircularProgress size={24}/> : "Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <form onSubmit={formik.handleSubmit} id="form" noValidate>
            <AlertNotification/>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <div style={{textAlign: "right", width: "100%"}}>
                    <span style={{color: "#797777"}}>Step {step} of 2</span>
                </div>

                {formik.errors.accountType &&
                    <FormHelperText style={{color: "red"}}>{formik.errors.accountType}</FormHelperText>}
            </Box>
            <div style={{marginTop: "20px", marginBottom: "20px"}}>
                {step === 1 && SwitchAccountTypeForm()}
                {step === 2 && InputDataForm()}
            </div>
            <RegisterFormBottom/>
        </form>
    )

};

export default RegisterForm;
