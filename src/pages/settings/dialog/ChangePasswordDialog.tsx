import React from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField
} from "@mui/material";
import * as yup from "yup";
import {useFormik} from "formik";

interface IChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

interface IFormValues {
    oldPassword: string,
    newPassword: string,
}

const ChangePasswordDialog = ({open, onClose}: IChangePasswordDialogProps) => {

    const initialValues: IFormValues = {
        oldPassword: '',
        newPassword: '',
    }

    const validationSchema = yup.object().shape({
        oldPassword: yup.string()
            .required('old password is a required field')
            .nullable()
            .min(6)
            .max(255),
        newPassword: yup.string()
            .required('new password is a required field')
            .nullable()
            .min(6)
            .max(255),
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
        // const updatedArtist = {
        //     id: artist.id,
        //     firstname: values.firstname,
        //     lastname: values.lastname,
        //     address: values.address,
        //     description: values.description,
        // } as Artist
        //
        // await mutationUpdateArtist.mutateAsync(updatedArtist)
        //     .then(() => {
        //         artist.firstname = updatedArtist.firstname;
        //         artist.lastname = updatedArtist.lastname;
        //         artist.address = updatedArtist.address;
        //         artist.description = updatedArtist.description;
        //         onClose();
        //     });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit password</DialogTitle>
            <Divider/>
            <DialogContent style={{paddingTop: "0px"}}>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Old password"
                        name={"oldPassword"}
                        defaultValue={formik.values.oldPassword}
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        error={!!formik.errors.oldPassword} helperText={formik.errors.oldPassword}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="New password"
                        name={"newPassword"}
                        defaultValue={formik.values.newPassword}
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        error={!!formik.errors.newPassword} helperText={formik.errors.newPassword}
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
