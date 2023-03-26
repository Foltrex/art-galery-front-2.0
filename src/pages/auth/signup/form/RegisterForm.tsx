import {Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import {useEffect} from "react";
import {useCookies} from 'react-cookie';
import {useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useGetArtistByAccountId, useUpdateArtistById} from "../../../../api/ArtistApi";
import {useRegister} from '../../../../api/AuthApi';
import {useGetRepresentativeByAccountId, useUpdateRepresentativeById} from "../../../../api/RepresentativeApi";
import PasswordTextField from "../../../../components/form/PasswordTextField";
import AlertNotification from '../../../../components/notifications/AlertNotification';
import {Artist} from "../../../../entities/artist";
import {AccountEnum} from "../../../../entities/enums/AccountEnum";
import {Representative} from "../../../../entities/representative";
import {AuthService} from "../../../../services/AuthService";
import {TokenService} from "../../../../services/TokenService";
import {useRootStore} from "../../../../stores/provider/RootStoreProvider";
import RegisterFormBottom from './RegisterFormBottom';

interface IRegisterFormValues {
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    accountType: AccountEnum | string,
}

const RegisterForm = () => {
    const { alertStore } = useRootStore();
    const navigate = useNavigate();
    const mutationRegister = useRegister();

    const [cookies, setCookie] = useCookies(['token']);

    const initialValues: IRegisterFormValues = {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
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
        firstname: yup.string()
            .required()
            .min(1),
        lastname: yup.string()
            .required()
            .min(1),
        accountType: yup.string()
            .required('account type is a required field')
    })

    const formik = useFormik({
        initialValues: initialValues,
        validateOnChange: false,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        }
    })

    const options = [
        { label: "Organization", value: AccountEnum.REPRESENTATIVE },
        { label: "Artist", value: AccountEnum.ARTIST },
    ];

    const currentAccountId = AuthService.isAuthenticated()
        ? TokenService.getCurrentAccountId()
        : undefined;

    const { data: representative } = useGetRepresentativeByAccountId(currentAccountId);
    const mutationUpdateRepresentative = useUpdateRepresentativeById(representative?.id);

    const { data: artist } = useGetArtistByAccountId(currentAccountId);
    const mutationUpdateArtist = useUpdateArtistById(artist?.id);

    useEffect(() => {
        if (representative) {
            const representativeObj = {
                ...representative,
                firstname: formik.values.firstname,
                lastname: formik.values.lastname,
            } as Representative;
            mutationUpdateRepresentative.mutateAsync(representativeObj)
                .then(() => navigate('/'));
        } else if (artist) {
            const artistObj = {
                ...artist,
                firstname: formik.values.firstname,
                lastname: formik.values.lastname,
            } as Artist;
            mutationUpdateArtist.mutateAsync(artistObj)
                .then(() => navigate('/'));
        }
    }, [representative, artist])

    const submit = async (values: IRegisterFormValues) => {
        try {
            const response = await mutationRegister.mutateAsync(values)
            AuthService.setToken(response.data.token);
            alertStore.setShow(false)
        } catch (error: any) {
            console.log(error.response.data.message)
            alertStore.setShow(true, 'error', "Registration error", error.response.data.message);
        }
    }

    return (
        <form onSubmit={formik.handleSubmit}>
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
            <TextField
                margin="normal"
                required
                fullWidth
                label="Firstname"
                name={"firstname"}
                defaultValue={formik.values.firstname}
                onChange={formik.handleChange}
                error={!!formik.errors.firstname} helperText={formik.errors.firstname}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Lastname"
                name={"lastname"}
                defaultValue={formik.values.lastname}
                onChange={formik.handleChange}
                error={!!formik.errors.lastname} helperText={formik.errors.lastname}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={formik.isSubmitting}
                sx={{ mt: 3, mb: 2 }}
            >
                {formik.isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
            <RegisterFormBottom />
        </form>
    )

};

export default RegisterForm;
