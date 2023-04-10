import {Button, CircularProgress, Grid, TextField, Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useRegister} from '../../../../api/AuthApi';
import PasswordTextField from "../../../../components/form/PasswordTextField";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import {AccountEnum} from "../../../../entities/enums/AccountEnum";
import {AuthService} from "../../../../services/AuthService";
import {useRootStore} from "../../../../stores/provider/RootStoreProvider";
import RegisterFormBottom from './RegisterFormBottom';
import {Help} from "@mui/icons-material";

interface IRegisterFormValues {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
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
    const [accountType, setAccountType] = useState<string>("");

    const initialValues: IRegisterFormValues = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
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
        firstName: yup.string()
            .required()
            .min(2),
        lastName: yup.string()
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

    useEffect(() => {
        alertStore.setShow(false)
    }, [accountType])

    const submit = async (values: IRegisterFormValues) => {
        try {
            const response = await mutationRegister.mutateAsync(values)
            AuthService.setToken(response.data.token);
            alertStore.setShow(false)
            navigate('/');
        } catch (error: any) {
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
                                setAccountType(AccountEnum.REPRESENTATIVE)
                            }}
                        >
                            <Tooltip title={
                                <div style={{textAlign: 'center'}}>I am bar, hotel, casino or restaurant representative,
                                    and our facility is open for art expositions</div>
                            }>
                                <Help/>
                            </Tooltip>&nbsp;
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
                                setAccountType(AccountEnum.ARTIST)
                            }}
                        >
                            <Tooltip title={
                                <div style={{textAlign: 'center'}}>I am content creator, and I'm searching for room to
                                    host my arts</div>
                            }>
                                <Help/>
                            </Tooltip>&nbsp;
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
                    name={"firstName"}
                    required
                    defaultValue={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={!!formik.errors.firstName} helperText={formik.errors.firstName}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Lastname"
                    name={"lastName"}
                    defaultValue={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={!!formik.errors.lastName} helperText={formik.errors.lastName}
                />
                <Grid container spacing={1} rowSpacing={1} style={{marginTop: "10px"}}>
                    <Grid item lg={6} xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={() => setAccountType("")}
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
            {accountType !== "" && <AlertNotification/>}
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px'
            }}
            >
                {accountType === AccountEnum.REPRESENTATIVE &&
                    <div style={{color: "#797777"}}>Organization representative</div>}
                {accountType === AccountEnum.ARTIST && <div style={{color: "#797777"}}>Content creator</div>}
                <div style={{marginLeft: 'auto', textAlign: "right", color: "#797777"}}>
                    Step {accountType === "" ? 1 : 2} of 2
                </div>
            </Box>

            <div style={{marginBottom: '20px'}}>
                {accountType === "" && SwitchAccountTypeForm()}
                {accountType !== "" && InputDataForm()}
            </div>
            <RegisterFormBottom/>
        </form>
    )

};

export default RegisterForm;
