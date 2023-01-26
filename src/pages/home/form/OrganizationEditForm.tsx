import React, {useState} from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {Button, CircularProgress, FormControlLabel, FormGroup, Switch, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import AlertNotification from "../../../components/notifications/AlertNotification";
import Container from "@mui/material/Container";
import * as yup from "yup";
import MapDialog from "../../../components/map/MapDialog";

const OrganizationEditForm = () => {

    const initialValues = {
        name: '',
        address: null
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name cannot be empty').min(1),
        // address: yup.string().required('Address cannot be empty').min(1)
        address: yup.object().required('Address cannot be empty').nullable()
    })

    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
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
                                <MapDialog open={open} handleClose={handleClose}/>
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
                                    InputProps={{readOnly: true, disableUnderline: true}}
                                    defaultValue={formik.values.address}
                                    onClick={handleClickOpen}
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
        </div>
    );
};

export default OrganizationEditForm;