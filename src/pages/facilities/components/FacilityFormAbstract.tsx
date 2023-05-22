import {
    Button,
    CircularProgress,
    Container,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
    Tooltip
} from "@mui/material";
import {useFormik} from "formik";
import * as React from "react";
import {useState} from "react";
import * as yup from "yup";
import {OrganizationsDropdown} from "../../../components/form/OrganizationsDropdown";
import MapDialog from "../../../components/map/MapDialog";
import {Address} from "../../../entities/address";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {Facility} from "../../../entities/facility";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {findOrganizationId} from "../../../util/MetadataUtil";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ImageSlider from "../../../components/ui/ImageSlider";
import {EntityFile} from "../../../entities/entityFile";


export const FacilityFormAbstract = (props: { data: Facility, back: () => void, onSubmit: (facility: Facility) => Promise<Facility|null> }) => {
    const { authStore } = useRootStore();
    const account = authStore.account;
    const [currentIndex, setCurrentIndex] = useState(0);
    const organizationId = (account.accountType === AccountEnum.REPRESENTATIVE
        ? findOrganizationId(account)
        : props.data.organizationId) as string;

     const [openMap, setOpenMap] = useState(false)

    const [slides, setSlides] = useState(props.data.images);


    const validationShape = {
        name: yup.string()
            .required()
            .min(2)
            .max(255),
        address: yup.object()
            .required()
            .nullable(),
    };
    if (account.accountType === AccountEnum.SYSTEM) {
        //@ts-ignore
        validationShape.organizationId = yup.string().required("Please select organization");
    }
    const validationSchema = yup.object().shape(validationShape)

    const formik = useFormik({
        initialValues: {
            ...props.data,
            organizationId: organizationId,
            images: ([] as EntityFile[]).concat(props.data.images || [])
        },
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            values.id = props.data.id || '';
            values.images = slides;
            values.organizationId = values.organizationId || organizationId || '';
            return props.onSubmit(values)
                .then(() => setSubmitting(false))
                .catch(() => setSubmitting(false))
        },
    });

    return (
        <Container maxWidth='lg'>
            <ImageSlider
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                slides={slides}
                setSlides={setSlides}
            />
            <form onSubmit={formik.handleSubmit} id="facility_add_edit" noValidate>
                {openMap && <MapDialog
                    open={true}
                    onClose={() => setOpenMap(false)}
                    setFieldValue={(value: Address) => {
                        formik.setFieldValue('address', value)
                    }}
                    address={formik.values.address as Address}
                />}
                <TextField
                    fullWidth={true}
                    margin="normal"
                    required
                    label="Name"
                    name={"name"}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={!!formik.errors.name} helperText={formik.errors.name}
                />

                {/*@ts-ignore*/}
                {account.accountType === AccountEnum.SYSTEM
                    && <OrganizationsDropdown size={"medium"} value={formik.values.organizationId || null} error={formik.errors.organizationId}
                        onChange={(s) => formik.setFieldValue('organizationId', s, true)} />}
                <TextField
                    fullWidth={true}
                    margin="normal"
                    required
                    label="Address"
                    name={"address"}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={formik.values.address === null ? undefined : { shrink: true }}
                    value={typeof formik.values.address === "object" ?
                        formik.values.address?.name : formik.values.address
                    }
                    onClick={() => setOpenMap(true)}
                    onChange={formik.handleChange}
                    error={!!formik.errors.address}
                    helperText={formik.errors.address?.name}
                />
                <FormGroup>
                    <FormControlLabel control={
                        <Switch
                            name={"Status"}
                            checked={formik.values.isActive as boolean}
                            onChange={() => formik.setFieldValue('isActive', !formik.values.isActive, false)}
                        />
                    } label={<span style={{display: 'flex'}}>Status <Tooltip title={
                        "Only active facilities may accept new offers. If facility is inactive," +
                        " it would be shown in catalog until all art objects would be sold or canceled."}>
                        <HelpOutlineIcon color={"primary"}/></Tooltip></span>} />
                </FormGroup>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                    spacing={2}
                    style={{marginTop: "15px"}}
                >
                    <Button size={"large"}
                            sx={{width: '25%'}}
                            fullWidth
                            color={"primary"}
                            variant="outlined"
                            onClick={props.back}
                    >
                        Back
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            sx={{width: '25%'}}
                            color={"success"}
                            variant="outlined"
                            type="submit"
                            form={"facility_add_edit"}
                            disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? <CircularProgress /> : "Save"}
                    </Button>
                </Stack>
            </form>
        </Container>
    )
}