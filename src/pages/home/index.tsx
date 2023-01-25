import {
    Button,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
    TextField,
    Typography
} from '@mui/material';

import {Stack} from '@mui/system';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Organization} from '../../entities/organization';
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import {OrganizationApi} from "../../api/OrganizationApi";
import {AuthService} from "../../services/AuthService";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {Form, Formik} from "formik";
import AlertNotification from "../../components/notifications/AlertNotification";
import * as yup from "yup";

const OrganizationProfile = () => {

    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const accountId = AuthService.getCurrentAccountId()
        OrganizationApi.getOrganizationByAccountId(accountId)
            .then(response => {
                setOrganization(response.data)
                setLoading(false)
            })
    }, [])

    // const organization: Organization = {
    //     id: '1',
    //     name: 'Roga and Kopita',
    //     address: {
    //         id: '312414',
    //         city: {
    //             id: 'asdf12',
    //             name: 'Homel',
    //             latitude: 12.21,
    //             longitude: 31.41,
    //         },
    //         streetName: 'Hataevhicha',
    //         streetNumber: 51,
    //     },
    //     status: OrganizationStatusEnum.NEW,
    //     facilities: []
    // }

    const initialValues = {
        name: '',
        address: ''
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name cannot be empty').min(1),
        address: yup.string().required('Address cannot be empty').min(1)
    })


    const OrganizationForm = () => {
        return (
            <Container component="main" maxWidth="sm">
                <CssBaseline/>
                <Box sx={{
                    marginTop: 14,
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: "1px solid",
                    borderColor: "#b4b2b2",
                    borderRadius: "8px",
                    padding: "25px"
                }}
                >
                    <Typography component="h1" variant="h5">Edit organization</Typography>
                    <Formik
                        validateOnChange={false}
                        validateOnBlur={true}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values, {setSubmitting}) => {
                            setSubmitting(true)
                            // await submit(values.email, values.password)
                            setSubmitting(false)
                        }}
                    >
                        {formik => (
                            <Form noValidate>
                                <AlertNotification/>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Name"
                                    defaultValue={formik.values.name}
                                    onChange={(event) => {
                                        formik.setFieldValue('name', event.target.value)
                                    }}
                                    error={!!formik.errors.name} helperText={formik.errors.name}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Address"
                                    defaultValue={formik.values.address}
                                    onChange={(event) => {
                                        formik.setFieldValue('address', event.target.value)
                                    }}
                                    error={!!formik.errors.address} helperText={formik.errors.address}
                                />
                                <FormGroup>
                                    <FormControlLabel control={<Switch defaultChecked/>} label="isActive"/>
                                </FormGroup>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color={"success"}
                                    disabled={formik.isSubmitting}
                                    sx={{mt: 3, mb: 2}}
                                >
                                    {formik.isSubmitting ? <CircularProgress/> : "Save changes"}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Container>
        )
    }

    const OrganizationInfo = () => {
        return (
            <Grid container
                  spacing={0}
                  sx={{marginTop: "4%"}}
                  justifyContent="center"
            >
                <Grid item sm={3}>
                    <img src={'/images/logo.png'} alt={'Company logo'} width='250' height='250'/>
                </Grid>
                <Grid item sm={5}>
                    <Typography variant='h4'>
                        {organization.name ? organization.name : 'The name is not set'}
                    </Typography>
                    <Divider/>
                    <Stack spacing={2} sx={{marginTop: 4}}>
                        <Grid container>
                            <Grid item sm={4}><strong>Status</strong></Grid>
                            <Grid item sm={8}>
                             <span style={{color: PrepareDataUtil.getOrganizationStatusColor(organization.status)}}>
                                {organization.status}
                             </span>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={4}><strong>Email</strong></Grid>
                            <Grid item sm={8}>tonasdf@gmail.com</Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={4}><strong>Address</strong></Grid>
                            <Grid item sm={8}>
                                {organization.address ? PrepareDataUtil.parseAddress(organization.address) : "The address is not set"}
                            </Grid>
                        </Grid>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2327.1556905573466!2d26.873946816081872!3d54.31887890911977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dc742535316e4f%3A0xc55af1e363a4e804!2sUlitsa%20M.bogdanovicha%2C%20Maladzie%C4%8Dna!5e0!3m2!1sen!2sby!4v1673598101285!5m2!1sen!2sby"
                            width="600"
                            height="350"
                            style={{border: '0'}}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"/>
                    </Stack>
                </Grid>
            </Grid>
        )
    }


    const Render = () => {
        if (loading) {
            return <CircularProgress/>
        }

        if (organization.status === OrganizationStatusEnum.NEW) {
            return <OrganizationForm/>
        } else {
            return <OrganizationInfo/>
        }

    }

    return (
        <div>
            <Render/>
        </div>
    );
};

export default OrganizationProfile;
