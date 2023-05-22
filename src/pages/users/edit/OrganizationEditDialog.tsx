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
import MapDialog from "../../../components/map/MapDialog";
import {Address} from "../../../entities/address";
import * as yup from "yup";
import {Organization} from "../../../entities/organization";
import {OrganizationStatusEnum} from "../../../entities/enums/organizationStatusEnum";
import {useUpdateOrganizationById} from '../../../api/OrganizationApi';
import {getErrorMessage} from "../../../components/error/ResponseError";

interface IOrganizationEditDialogProps {
    open: boolean;
    onClose: () => void;
    organization: Organization,
}

interface IFormValues {
    name: string,
    address: Address | null | string,
    isActive: boolean
}

function OrganizationEditDialog({open, onClose, organization}: IOrganizationEditDialogProps) {
    const [openMap, setOpenMap] = useState(false)

    const initialValues: IFormValues = {
        name: organization.name,
        address: organization.address,
        isActive: organization.status === OrganizationStatusEnum.ACTIVE,
    }

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required()
            .min(2)
            .max(255),
        address: yup.object()
            .required()
            .nullable()
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        onSubmit: (values, {setSubmitting}) => {
            setSubmitting(true)
            return submit(values).then((r) => {
                setSubmitting(false)
                return r;
            }).catch(e => {
                setSubmitting(false);
                return e;
            })
        },
    });

    const mutationUpdateOrganization = useUpdateOrganizationById(
        organization.id,
        (error) => getErrorMessage("Failed to update organization", error)
    );

    const submit = (values: IFormValues) => {
        const updatedOrganization = {
            id: organization.id,
            name: values.name,
            address: values.address,
            status: values.isActive ? OrganizationStatusEnum.ACTIVE : OrganizationStatusEnum.INACTIVE,
        } as Organization;

        return mutationUpdateOrganization.mutateAsync(updatedOrganization)
            .then(() => {
                organization.name = updatedOrganization.name;
                organization.address = updatedOrganization.address;
                organization.status = updatedOrganization.status;
                onClose();
            });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit organization</DialogTitle>
            <Divider/>
            <DialogContent style={{paddingTop: "0px"}}>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    {openMap && <MapDialog
                        open={true}
                        onClose={() => setOpenMap(false)}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                        address={formik.values.address as Address}
                    />}
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
                        InputProps={{readOnly: true}}
                        InputLabelProps={formik.values.address === null ? undefined : {shrink: true}}
                        value={typeof formik.values.address === "object" ?
                            formik.values.address?.name : formik.values.address
                        }
                        onClick={() => setOpenMap(true)}
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
