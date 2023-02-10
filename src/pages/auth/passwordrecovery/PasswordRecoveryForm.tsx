import React, {useEffect, useState} from 'react';
import * as yup from "yup";
import {useFormik} from "formik";
import {Button, CircularProgress, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import AlertNotification from "../../../components/notifications/AlertNotification";
import {useFetchAccountByEmail} from "../../../api/AccountApi";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";

interface IFormEmailValues {
    email: string,
}

const PasswordRecoveryForm = () => {
    const {alertStore} = useRootStore();

    const initialValues: IFormEmailValues = {
        email: '',
    }

    const validationSchema = yup.object().shape({
        email: yup.string().required('Email cannot be empty').min(1).email("Email not valid"),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        },
    });

    const [emailSearch, setEmailSearch] = useState('');
    const {data, isFetched} = useFetchAccountByEmail(emailSearch);

    useEffect(() => {
        alertStore.setShow(false)
    }, [])

    useEffect(() => {
        if (data === undefined && isFetched) {
            alertStore.setShow(true, "error", ' ', "Account with this email not found!")
        }
    }, [isFetched])

    const submit = async (values: IFormEmailValues) => {
        setEmailSearch(values.email)
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit} id="form" noValidate>
                <AlertNotification/>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    name={"email"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!formik.errors.email} helperText={formik.errors.email}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={formik.isSubmitting}
                    sx={{mt: 3, mb: 2}}
                >
                    {formik.isSubmitting ? <CircularProgress/> : "Continue"}
                </Button>
                <Link to={"/auth/signin"} style={{textDecoration: "none"}}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        Back
                    </Button>
                </Link>
            </form>
        </div>
    );
};

export default PasswordRecoveryForm;
