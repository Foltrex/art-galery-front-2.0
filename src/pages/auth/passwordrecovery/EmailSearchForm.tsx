import React, {useEffect, useState} from 'react';
import {Button, TextField} from "@mui/material";
import {createSearchParams, Link, useNavigate} from "react-router-dom";
import * as yup from "yup";
import {useFormik} from "formik";
import {useGetAll} from "../../../api/AccountApi";
import {useSendPasswordRecoveryCode} from "../../../api/AuthApi";
import Bubble from "../../../components/bubble/Bubble";
import {getErrorMessage} from "../../../components/error/ResponseError";


interface IFormEmailValues {
    email: string,
}

const EmailSearchForm = () => {
    const navigate = useNavigate();
    const [emailSearch, setEmailSearch] = useState('');
    const {data, isFetched, isLoading} = useGetAll({email: emailSearch}, (error) => {
        getErrorMessage("Failed to perform search routine for account with such email. Most probably service unavailable or in maintenance.lgdfgd Please try again after couple minutes", error);
    }, {enabled: !emailSearch});
    const mutationSendPasswordRecoveryCode = useSendPasswordRecoveryCode((error) => {
        getErrorMessage("Failed to send password recovery code. Most probably service unavailable or in maintenance. Please try again after couple minutes", error);
    });

    const initialValues: IFormEmailValues = {
        email: '',
    }

    const validationSchema = yup.object().shape({
        email: yup.string()
            .required()
            .min(3)
            .email(),
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

    const submit = async (values: IFormEmailValues) => {
        setEmailSearch(values.email)
    }

    useEffect(() => {
        if ((data === undefined || data.content.length === 0) && isFetched) {
            Bubble.error("Account with this email not found!")
            setEmailSearch("")
        } else if (data !== undefined && data.content.length > 0) {
            mutationSendPasswordRecoveryCode.mutateAsync({receiver: emailSearch})
                .then(() => {
                    navigate({
                        pathname: "/auth/passwordrecovery",
                        search: createSearchParams({
                            email: emailSearch,
                        }).toString()
                    });
                    Bubble.success("Message with confirmation code was sent to provided email")
                })
        }
    }, [isFetched, data])

    return (
        <form onSubmit={formik.handleSubmit} id="form" noValidate>
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
                disabled={isLoading || mutationSendPasswordRecoveryCode.isLoading}
                sx={{mt: 3, mb: 2}}
            >
                Continue
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
    );
};

export default EmailSearchForm;
