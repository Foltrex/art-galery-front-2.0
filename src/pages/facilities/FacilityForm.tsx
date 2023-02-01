import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, SelectChangeEvent, Switch, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as React from 'react';
import { useGetOrganizationByAccountId } from '../../api/OrganizationApi';
import MapDialog from '../../components/map/MapDialog';
import { Address } from '../../entities/address';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import { Facility } from '../../entities/facility';
import { Organization } from '../../entities/organization';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import * as yup from 'yup';

interface IFacilityFormProps {
    open: boolean;
    onClose: () => void;
    facility?: Facility;
}

interface FormValues {
    name: string;
    isActive: boolean;
    address: Address | string;
}

function FacilityForm({ open, onClose, facility }: IFacilityFormProps) {
    const token = TokenService.decode(AuthService.getToken());
    const { data } = useGetOrganizationByAccountId(token.id);
    const [facilityObj, setFacility] = React.useState(facility ?? { organization: data } as Facility);

    const [openMap, setOpenMap] = React.useState(false);

    React.useEffect(() => {
        if (facility) {
            setFacility(facility);
        }
    }, [facility])

    const initialValues: FormValues = {
        name: facilityObj.name,
        isActive: facilityObj.isActive,
        address: facilityObj.address
    };

    const validationSchema = yup.object({
        name: yup.string()
            .min(1)
            .required('Name cannot be empty')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: values => {
            alert(JSON.stringify(values))
        },
        enableReinitialize: true
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='xs'
        >
            <DialogTitle>
                {facility ? 'Edit' : 'Create'} Facility
            </DialogTitle>
            <Divider />

            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <MapDialog
                        open={openMap}
                        onClose={() => setOpenMap(false)}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                    />
                    <h1>{typeof formik.values.address === "object"}</h1>

                    <Grid container rowSpacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name='name'
                                label='Name'
                                onChange={formik.handleChange}
                                type="name"
                                fullWidth
                                required
                                value={formik.values.name}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name='isActive'
                                        onChange={formik.handleChange}
                                        checked={formik.values.isActive}
                                    />
                                }
                                label='Activity'
                                sx={{ mt: 1 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Address"
                                name={"address"}
                                InputProps={{ readOnly: true, disableUnderline: true }}
                                InputLabelProps={{ shrink: true }}
                                value={typeof formik.values.address === "object" ?
                                    formik.values.address?.fullName : formik.values.address
                                }
                                onClick={() => setOpenMap(true)}
                                onChange={formik.handleChange}
                                error={!!formik.errors.address} 
                                helperText={formik.errors.address}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} form='form' variant='text'>Cancel</Button>
                <Button type='submit' variant='contained'>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FacilityForm;
