import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {FormikHelpers, useFormik} from "formik";
import React, {useEffect} from "react";
import * as yup from 'yup';
import {useGetAccountById} from "../../api/AccountApi";
import {useRegisterRepresentative} from "../../api/AuthApi";
import {useGetAllFacilitiesByAccountId} from "../../api/FacilityApi";
import {useGetOrganizationByAccountId} from "../../api/OrganizationApi";
import {useGetOrganizationRoles} from "../../api/OrganizationRoleApi";
import {useUpdateRepresentativeById} from "../../api/RepresentativeApi";
import {Facility} from "../../entities/facility";
import {OrganizationRole} from "../../entities/organizationRole";
import {Representative} from "../../entities/representative";
import {AuthService} from "../../services/AuthService";
import {TokenService} from "../../services/TokenService";

interface IRepresentativeFormProps {
    open: boolean;
    onClose: () => void;
    representative?: Representative;
}

interface FormValues {
    email: string;
    firstname: string;
    lastname: string;
    facility: Facility;
    organizationRole: OrganizationRole;
}

function RepresentativeForm({ open, onClose, representative }: IRepresentativeFormProps) {
    const token = TokenService.decode(AuthService.getToken());
    
    const { data: facilities } = useGetAllFacilitiesByAccountId(token.id);
    const { data: organizationRoles } = useGetOrganizationRoles();
    const { data: organization } = useGetOrganizationByAccountId(token.id);
    const { data: representativeAccount } = useGetAccountById(representative?.accountId);

    const [representativeObj, setRepresentative] = React.useState(
        representative ?? { 
            accountId: token.id,
            organization: organization
        } as Representative
    );

    useEffect(() => {
        if (representative) {
            setRepresentative(representative);
        } else if (organization) {
            setRepresentative({...representativeObj, organization: organization});
        }
    }, [representative, organization]);

    const initialValues: FormValues = {
        email: representativeAccount?.email ?? '',
        firstname: representativeObj.firstname,
        lastname: representativeObj.lastname,
        facility: representativeObj.facility,
        organizationRole: representativeObj.organizationRole
    };

    const validationSchema = yup.object({
        email: yup.string()
            .email(),
        firstname: yup.string()
            .min(1)
            .required(),
        lastname: yup.string()
            .min(1)
            .required(),
        facility: yup.object()
            .required(),
    });

    const mutationSaveRepresentative = useRegisterRepresentative();
    const mutationUpdateRepresentative = useUpdateRepresentativeById(representativeObj.id);

    const onSaveRepresentative = async (values: FormValues, {setSubmitting}: FormikHelpers<FormValues>) => {
        setSubmitting(true);
        try {
            if (!representativeObj.id) {
                const representative = {
                    email: values.email,
                    firstname: values.firstname,
                    lastname: values.lastname,
                    organizationId: representativeObj.organization.id,
                    facilityId: values.facility.id,
                }
    
                await mutationSaveRepresentative.mutateAsync(representative);
            } else {
                const representative: Representative = {
                    ...representativeObj,
                    firstname: values.firstname,
                    lastname: values.lastname
                };

                await mutationUpdateRepresentative.mutateAsync(representative);
            }
        } catch (e) {
            // Add push notification
            console.log(e);
        } finally {
            setSubmitting(false);
            onClose();
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: onSaveRepresentative,
        enableReinitialize: true
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    {representative ? 'Edit' : 'Create'} Representative
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name='email'
                                label='Email'
                                onChange={formik.handleChange}
                                type="name"
                                fullWidth
                                required
                                value={formik.values.email}
                                variant="standard"
                                disabled={!!representative}
                            />
                        </Grid>
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
                                    onChange={e => {
                                        const selectedFacility = facilities?.find(f => f.id === e.target.value);
                                        formik.setFieldValue('facility', selectedFacility);
                                    }}
                                >
                                    {facilities?.map(facility => (
                                        <MenuItem key={facility.id} value={facility.id}>
                                            {facility.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} variant='text'>Cancel</Button>
                    <Button 
                        type='submit' 
                        variant='contained'
                        disabled={formik.isSubmitting}
                    >
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RepresentativeForm;
