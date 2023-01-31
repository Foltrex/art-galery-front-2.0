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
import {OrganizationApi} from "../../api/OrganizationApi";
import {Organization} from "../../entities/organization";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";

interface IFormProps {
    open: boolean;
    onClose: () => void;
    organization: Organization,
    // onSubmit: () => void;
}

interface InterfaceInitialValues {
    name: string | null,
    address: Address | null | string,
    isActive: boolean
}


function OrganizationEditDialog({open, onClose, organization}: IFormProps) {

    const initialValues: InterfaceInitialValues = {
        name: organization.name,
        address: organization.address,
        isActive: organization.status === OrganizationStatusEnum.ACTIVE,
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
            await submit(values)
            setSubmitting(false)
        },
    });

    const submit = async (values: InterfaceInitialValues) => {
        const updatedOrganization = {
            id: organization.id,
            name: values.name,
            address: values.address,
            status: values.isActive ? OrganizationStatusEnum.ACTIVE : OrganizationStatusEnum.INACTIVE,
        } as Organization

        await OrganizationApi.updateOrganizationById(updatedOrganization, updatedOrganization.id)
            .then(() => {
                organization.name = updatedOrganization.name;
                organization.address = updatedOrganization.address;
                organization.status = updatedOrganization.status;
                onClose()
            })
    }

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
            <DialogContent style={{paddingTop: "0px"}}>
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
                        <FormControlLabel control={
                            <Switch
                                name={"isActive"}
                                checked={formik.values.isActive}
                                onChange={formik.handleChange}
                            />
                        } label="isActive"/>
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