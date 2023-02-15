import React from 'react';
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider} from "@mui/material";
import * as yup from "yup";
import {useFormik} from "formik";
import {useUpdateAccountPasswordById} from "../../../api/AccountApi";
import {TokenService} from "../../../services/TokenService";
import PasswordTextField from "../../../components/form/PasswordTextField";
import AlertNotification from '../../../components/notifications/AlertNotification';
import {useRootStore} from "../../../stores/provider/RootStoreProvider";

interface IChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

interface IFormValues {
    oldPassword: string,
    newPassword: string,
}

const ChangePasswordDialog = ({open, onClose}: IChangePasswordDialogProps) => {
    const {alertStore} = useRootStore();
    const mutationUpdateAccountPassword = useUpdateAccountPasswordById(TokenService.getCurrentAccountId());

    const initialValues: IFormValues = {
        oldPassword: '',
        newPassword: '',
    }

    const validationSchema = yup.object().shape({
        oldPassword: yup.string()
            .required('old password is a required field')
            .nullable()
            .min(6, 'old password must be at least 6 characters')
            .max(255, 'old password must be at most 255 characters'),
        newPassword: yup.string()
            .required('new password is a required field')
            .nullable()
            .min(6, 'new password must be at least 6 characters')
            .max(255, 'new password must be at most 255 characters'),

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

    const submit = async (values: IFormValues) => {
        mutationUpdateAccountPassword.mutateAsync(values)
            .then(() => {
                onClose();
            })
            .catch(error => {
                alertStore.setShow(true, "error", " ", error.response.data.message)
                console.log(error.response.data.message)
            })
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit password</DialogTitle>
            <Divider/>
            <DialogContent>
                <AlertNotification/>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    <PasswordTextField
                        id={"old-password"}
                        label={"Old password"}
                        name={"oldPassword"}
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        error={formik.errors.oldPassword}
                    />
                    <PasswordTextField
                        id={"new-password"}
                        label={"New password"}
                        name={"newPassword"}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        error={formik.errors.newPassword}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='text'>Cancel</Button>
                <Button variant='contained' type="submit" form={"form"} disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? <CircularProgress/> : "Save"}
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default ChangePasswordDialog;
