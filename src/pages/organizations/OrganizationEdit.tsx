import {Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useGetOrganizationById} from '../../api/OrganizationApi';
import Loading from '../../components/ui/Loading';
import {OrganizationStatusEnum} from '../../entities/enums/organizationStatusEnum';
import {TokenService} from '../../services/TokenService';
import {useNavigate, useParams} from "react-router-dom";
import MapDialog from "../../components/map/MapDialog";
import {Address} from "../../entities/address";
import AlertNotification from "../../components/notifications/AlertNotification";
import * as yup from "yup";
import {useFormik} from "formik";
import {Container} from "@mui/system";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {OrganizationRoleEnum} from "../../entities/enums/organizationRoleEnum";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";

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

    const {authStore} = useRootStore();
    const account = authStore.account;

    const [openMap, setOpenMap] = useState(false)
    const [initialValues, setInitialValues] = useState<IFormValues>({
        name: '',
        address: null,
        status: '',
    })

    useEffect(() => {
        if (account) {
            if (mode === "CREATE" && account.accountType !== AccountEnum.SYSTEM) {
                navigate("/")
            }
            const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
            const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''

            if (organizationId !== matches.id || organizationRole !== OrganizationRoleEnum.CREATOR) {
                navigate("/")
            }
        }

    }, [account])

    useEffect(() => {
        if (!isFetching && !isLoading) {
            console.log(organization)
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
            .required()
            .nullable()
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            // await submit(values)
            setSubmitting(false)
        },
    });

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
                            formik.values.address?.fullName : formik.values.address
                        }
                        onClick={() => setOpenMap(true)}
                        onChange={formik.handleChange}
                        error={!!formik.errors.address} helperText={formik.errors.address}
                    />
                    <FormControl fullWidth margin="normal">
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
                    >
                        Back
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            disabled={mode === "CREATE"}
                    >
                        Participants
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            disabled={mode === "CREATE"}
                    >
                        Facilities
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            color={"success"}
                            variant="outlined"
                    >
                        Save
                    </Button>
                </Stack>
            </Container>
        </div>
    )

};

export default App;
