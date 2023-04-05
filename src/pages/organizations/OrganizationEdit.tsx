import {
    Button,
    CircularProgress,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useCreateOrganization, useGetOrganizationById, useUpdateOrganizationById} from '../../api/OrganizationApi';
import Loading from '../../components/ui/Loading';
import {OrganizationStatusEnum} from '../../entities/enums/organizationStatusEnum';
import {useNavigate, useParams} from "react-router-dom";
import MapDialog from "../../components/map/MapDialog";
import {Address} from "../../entities/address";
import AlertNotification from "../../components/notifications/AlertNotification";
import * as yup from "yup";
import {useFormik} from "formik";
import {Container} from "@mui/system";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {Organization} from "../../entities/organization";

interface IAppProps {
}

interface IFormValues {
    name: string,
    address: Address | null | string,
    status: OrganizationStatusEnum | string
}

const App: React.FunctionComponent<IAppProps> = (props) => {
    const navigate = useNavigate()
    const matches = useParams();
    const {data: organization, isLoading, isFetching} = useGetOrganizationById(matches.id);
    const mode = matches.id !== undefined ? "EDIT" : "CREATE";
    const [openOrganizationUsersDialog, setOpenOrganizationUsersDialog] = useState(false)
    const [openOrganizationFacilitiesDialog, setOpenOrganizationFacilitiesDialog] = useState(false)

    const {authStore} = useRootStore();
    const account = authStore.account;

    const [openMap, setOpenMap] = useState(false)
    const [initialValues, setInitialValues] = useState<IFormValues>({
        name: '',
        address: null,
        status: OrganizationStatusEnum.NEW,
    })

    useEffect(() => {
        if (account) {
            // if (mode === "CREATE" && account.accountType !== AccountEnum.SYSTEM) {
            //     navigate("/")
            // }
            // const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
            // const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''
            //
            // if (organizationId !== matches.id || organizationRole !== OrganizationRoleEnum.CREATOR) {
            //     navigate("/")
            // }
        }

    }, [account])

    useEffect(() => {
        if (!isFetching && !isLoading) {
            organization && setInitialValues({
                name: organization.name,
                address: organization!.address,
                status: organization!.status,
            })
        }
    }, [organization])

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required()
            .min(2)
            .max(255),
        address: yup.object()
            .required()
            .nullable(),
        status: yup.object()
            .nullable(),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        },
    });

    const mutationUpdateOrganization = useUpdateOrganizationById(matches.id!);
    const mutationCreateOrganization = useCreateOrganization();

    const submit = async (values: IFormValues) => {
        const request = {
            id: matches.id ? matches.id : '',
            name: values.name,
            address: values.address,
            status: values.status,
        } as Organization;
        if (mode === "CREATE") {
            await mutationCreateOrganization.mutateAsync(request)
                .then(response => {
                    navigate(`/organizations/${response.data.id}`)
                });
        } else if (mode === "EDIT") {
            await mutationUpdateOrganization.mutateAsync(request)
                .then(() => {

                });
        }
    }

    if (isLoading || account === undefined) {
        return <Loading/>
    }

    return (
        <div>
            <Container maxWidth='md'>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    <MapDialog
                        open={openMap}
                        onClose={() => setOpenMap(false)}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                        address={formik.values.address as Address}
                    />
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
                        InputProps={{readOnly: true}}
                        InputLabelProps={formik.values.address === null ? undefined : {shrink: true}}
                        value={typeof formik.values.address === "object" ?
                            formik.values.address?.name : formik.values.address
                        }
                        onClick={() => setOpenMap(true)}
                        onChange={formik.handleChange}
                        error={!!formik.errors.address} helperText={formik.errors.address}
                    />
                    <FormControl fullWidth margin="normal" error={!!formik.errors.status}
                    >
                        <InputLabel>Status</InputLabel>
                        <Select
                            name={"status"}
                            label="Status"
                            value={formik.values.status}
                            defaultValue={formik.values.status}
                            onChange={formik.handleChange}

                        >
                            <MenuItem value={OrganizationStatusEnum.NEW}>New</MenuItem>
                            <MenuItem value={OrganizationStatusEnum.ACTIVE}>Active</MenuItem>
                            <MenuItem value={OrganizationStatusEnum.INACTIVE}>Inactive</MenuItem>
                        </Select>
                        <FormHelperText style={{color: "red"}}>
                            {formik.errors.status ? formik.errors.status : ''}
                        </FormHelperText>
                    </FormControl>
                    {/*<FormGroup>*/}
                    {/*    <FormControlLabel control={*/}
                    {/*        <Switch*/}
                    {/*            name={"isActive"}*/}
                    {/*            checked={formik.values.isActive}*/}
                    {/*            onChange={formik.handleChange}*/}
                    {/*        />*/}
                    {/*    } label="isActive"/>*/}
                    {/*</FormGroup>*/}
                </form>
                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    style={{marginTop: "15px"}}
                >
                    <Button size={"large"}
                            color={"error"}
                            onClick={() => navigate("/organizations")}
                    >
                        Back
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            disabled={mode === "CREATE"}
                            onClick={() => setOpenOrganizationUsersDialog(true)}
                    >
                        Participants
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            disabled={mode === "CREATE"}
                            onClick={() => setOpenOrganizationFacilitiesDialog(true)}
                    >
                        Facilities
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            color={"success"}
                            variant="outlined"
                            type="submit" form={"form"} disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? <CircularProgress/> : "Save"}
                    </Button>
                </Stack>
            </Container>
        </div>
    )

};

export default App;
