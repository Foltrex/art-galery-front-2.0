import React, {useState} from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField
} from "@mui/material";
import {useFormik} from "formik";
import MapDialog from "../../components/map/MapDialog";
import {Address} from "../../entities/address";
import AlertNotification from "../../components/notifications/AlertNotification";
import * as yup from "yup";

interface IFormProps {
    open: boolean;
    onClose: () => void;
    // onSubmit: () => void;
}

interface InterfaceInitialValues {
    name: string,
    address: Address | null | string,
    isActive: boolean
}


function OrganizationEditDialog({open, onClose}: IFormProps) {

    const initialValues: InterfaceInitialValues = {
        name: '',
        address: null,
        isActive: false,
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name cannot be empty').min(1),
        address: yup.object().required('Address cannot be empty').nullable()
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            // await submit(values.email, values.password)
            setSubmitting(false)
        },
    });


    const [openMap, setOpenMap] = useState(false)

    const handleClickOpen = () => {
        setOpenMap(true);
    };

    const handleClose = () => {
        setOpenMap(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit organization</DialogTitle>
            <Divider/>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    <MapDialog
                        open={openMap}
                        handleClose={handleClose}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                    />
                    <h1>{typeof formik.values.address === "object"}</h1>
                    <AlertNotification/>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name={"name"}
                        defaultValue={formik.values.name}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={!!formik.errors.name} helperText={formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Address"
                        name={"address"}
                        InputProps={{readOnly: true, disableUnderline: true}}
                        InputLabelProps={{shrink: true}}
                        value={typeof formik.values.address === "object" ?
                            formik.values.address?.fullName : formik.values.address
                        }
                        onClick={handleClickOpen}
                        onChange={formik.handleChange}
                        error={!!formik.errors.address} helperText={formik.errors.address}
                    />
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={formik.values.isActive}/>} label="isActive"/>
                    </FormGroup>
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
}

export default OrganizationEditDialog;