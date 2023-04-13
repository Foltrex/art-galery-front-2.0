import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button, CircularProgress, TextField} from "@mui/material";
import * as yup from "yup";
import {useFormik} from "formik";
import {usePasswordRecovery} from "../../../api/AuthApi";
import PasswordTextField from "../../../components/form/PasswordTextField";
import Bubble from "../../../components/bubble/Bubble";
import {getErrorMessage} from "../../../util/PrepareDataUtil";


interface IPasswordRecoveryFormValues {
    email: string,
    code: string,
    password: string,
}

const PasswordRecoveryForm = () => {
    const navigate = useNavigate();
    const mutationPasswordRecovery = usePasswordRecovery();
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const value = queryParams.get("email")!;

    const initialValues: IPasswordRecoveryFormValues = {
        email: value !== null ? value : "",
        code: "",
        password: "",
    }

    const validationSchema = yup.object().shape({
        code: yup.string()
            .required()
            .length(6),
        password: yup.string()
            .required()
            .min(6),
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

    const submit = async (values: IPasswordRecoveryFormValues) => {
        console.log()
        mutationPasswordRecovery.mutateAsync(values)
            .then(() => {
                Bubble.success("Your password recovered successfully!")
                navigate('/auth/signin');
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                Bubble.error({message: "Failed to reset your password, error message is" + getErrorMessage(error), duration: 999999})
            })
    }

    return (
        <form onSubmit={formik.handleSubmit} id="form" noValidate>
            <TextField
                margin="normal"
                required
                fullWidth
                type={"number"}
                label="Code"
                name={"code"}
                value={formik.values.code}
                onChange={formik.handleChange}
                error={!!formik.errors.code} helperText={formik.errors.code}
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
                {formik.isSubmitting ? <CircularProgress size={24}/> : "Recovery password"}
            </Button>
            <Link to={"/auth/passwordrecovery"} style={{textDecoration: "none"}}>
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

export default PasswordRecoveryForm;
