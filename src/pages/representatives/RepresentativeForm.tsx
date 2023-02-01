import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, TextField } from "@mui/material";
import { useFormik } from "formik";
import { title } from "process";
import React, { useEffect } from "react";
import * as yup from 'yup';
import { useGetFacilitiesByAccountId } from "../../api/FacilityApi";
import { useGetOrganizationByAccountId } from "../../api/OrganizationApi";
import { useGetOrganizationRoles } from "../../api/OrganizationRoleApi";
import { OrganizationRoleEnum } from "../../entities/enums/organizationRoleEnum";
import { Facility } from "../../entities/facility";
import { OrganizationRole } from "../../entities/organizationRole";
import { Representative } from "../../entities/representative";
import { AuthService } from "../../services/AuthService";
import { TokenService } from "../../services/TokenService";

interface IRepresentativeFormProps {
    open: boolean;
    onClose: () => void;
    representative?: Representative;
}

interface FormValues {
    firstname: string;
    lastname: string;
    facility: Facility;
    organizationRole: OrganizationRole;
}

function RepresentativeForm({ open, onClose, representative }: IRepresentativeFormProps) {
    const token = TokenService.decode(AuthService.getToken());
    const { data: facilities } = useGetFacilitiesByAccountId(token.id);
    const { data: organizationRoles } = useGetOrganizationRoles();

    const [representativeObj, setRepresentative] = React.useState(
        representative ?? {} as Representative
    );

    useEffect(() => {
        if (representative) {
            setRepresentative(representative);
        }
    }, [representative]);

    const initialValues: FormValues = {
        firstname: representativeObj.firstname,
        lastname: representativeObj.lastname,
        facility: representativeObj.facility,
        organizationRole: representativeObj.organizationRole
    };

    const validationSchema = yup.object({
        firstname: yup.string()
            .min(1)
            .required(),
        lastname: yup.string()
            .min(1)
            .required(),
        facility: yup.object()
            .required(),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values));
        },
        enableReinitialize: true
    });

    const formTitle = representative
        ? 'Edit Representative'
        : 'Create Representative';


    return (

        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>{formTitle}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name='firstname'
                                label='Firstname'
                                onChange={formik.handleChange}
                                type="name"
                                fullWidth
                                required
                                value={formik.values.firstname}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name='lastname'
                                label='Lastname'
                                onChange={formik.handleChange}
                                type="name"
                                fullWidth
                                required
                                value={formik.values.lastname}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size='small'>
                                <InputLabel id='facility-label'>Facility</InputLabel>
                                <Select
                                    labelId='facility-label'
                                    name='facility'
                                    label='Facility'
                                    value={formik.values?.facility?.id ?? ''}
                                    required
                                    onChange={formik.handleChange}
                                >
                                    {facilities?.map(facility => (
                                        <MenuItem key={facility.id} value={facility.id}>
                                            {facility.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size='small'>
                                <InputLabel id='organization-role-label'>Organization Role</InputLabel>
                                <Select
                                    labelId='organization-role-label'
                                    name='organizationRole'
                                    label='Organization Role'
                                    value={formik.values?.organizationRole?.id ?? ''}
                                    required
                                    onChange={formik.handleChange}
                                >
                                    {organizationRoles?.map(role => (
                                        <MenuItem key={role.id} value={role.id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant='text'>Cancel</Button>
                    <Button type='submit' variant='contained'>Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RepresentativeForm;
