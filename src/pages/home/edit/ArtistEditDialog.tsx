import React, {useState} from 'react';
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
import {Address} from "../../../entities/address";
import {Artist} from "../../../entities/artist";
import * as yup from "yup";
import {useFormik} from "formik";
import MapDialog from "../../../components/map/MapDialog";
import {useUpdateArtistById} from '../../../api/ArtistApi';

interface IArtistEditDialogProps {
    open: boolean;
    onClose: () => void;
    artist: Artist,
}

interface IFormValues {
    firstname: string,
    lastname: string,
    description: string,
    address: Address | null | string,
}

const ArtistEditDialog = ({open, onClose, artist}: IArtistEditDialogProps) => {
    const [openMap, setOpenMap] = useState(false)

    const initialValues: IFormValues = {
        firstname: artist.firstname,
        lastname: artist.lastname,
        address: artist.address,
        description: artist.description,
    }

    const validationSchema = yup.object().shape({
        firstname: yup.string()
            .required()
            .nullable()
            .min(2)
            .max(255),
        lastname: yup.string()
            .required()
            .nullable()
            .min(2)
            .max(255),
        address: yup.object()
            .required()
            .nullable(),
        description: yup.string().required()
            .nullable()
            .min(2)
            .max(1024),
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

    const mutationUpdateArtist = useUpdateArtistById(artist.id);

    const submit = async (values: IFormValues) => {
        const updatedArtist = {
            id: artist.id,
            firstname: values.firstname,
            lastname: values.lastname,
            address: values.address,
            description: values.description,
        } as Artist

        await mutationUpdateArtist.mutateAsync(values as Artist)
            .then(() => {
                artist.firstname = updatedArtist.firstname;
                artist.lastname = updatedArtist.lastname;
                artist.address = updatedArtist.address;
                artist.description = updatedArtist.description;
                onClose();
            });
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs'>
            <DialogTitle>Edit artist</DialogTitle>
            <Divider/>
            <DialogContent style={{paddingTop: "0px"}}>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    <MapDialog
                        open={openMap}
                        onClose={() => setOpenMap(false)}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                        address={formik.values.address as Address}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Firstname"
                        name={"firstname"}
                        defaultValue={formik.values.firstname}
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        error={!!formik.errors.firstname} helperText={formik.errors.firstname}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Lastname"
                        name={"lastname"}
                        defaultValue={formik.values.lastname}
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        error={!!formik.errors.lastname} helperText={formik.errors.lastname}
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
                            formik.values.address?.fullName : formik.values.address
                        }
                        onClick={() => setOpenMap(true)}
                        onChange={formik.handleChange}
                        error={!!formik.errors.address} helperText={formik.errors.address}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Description"
                        name={"description"}
                        type="text"
                        multiline
                        rows={5}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        error={!!formik.errors.description} helperText={formik.errors.description}
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

export default ArtistEditDialog;
