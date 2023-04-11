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
import Loading from '../../../components/ui/Loading';
import {OrganizationStatusEnum} from '../../../entities/enums/organizationStatusEnum';
import {useNavigate} from "react-router-dom";
import MapDialog from "../../../components/map/MapDialog";
import {Address} from "../../../entities/address";
import AlertNotification from "../../../components/notifications/AlertNotification";
import * as yup from "yup";
import {useFormik} from "formik";
import {Container} from "@mui/system";
import {Organization} from "../../../entities/organization";
import OrganizationFacilitiesDialog from "./OrganizationFacilitiesDialog";
import OrganizationUsersDialog from "./OrganizationUsersDialog";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {Facility} from "../../../entities/facility";

interface IAppProps {
    data?: Organization;
    submit: (org: Organization) => Promise<boolean>
}

interface IFormValues {
    id: string
    name: string,
    address: Address | null | string,
    status: OrganizationStatusEnum | string,
    facilities: Facility[]
}

const OrganizationForm: React.FunctionComponent<IAppProps> = ({data, submit}) => {
    const navigate = useNavigate()
    const [openOrganizationUsersDialog, setOpenOrganizationUsersDialog] = useState(false)
    const [openOrganizationFacilitiesDialog, setOpenOrganizationFacilitiesDialog] = useState(false)
    const [openMap, setOpenMap] = useState(false)
    const {authStore} = useRootStore();
    const account = authStore.account;

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

    const [initialValues, setInitialValues] = useState<IFormValues>({
        id: '',
        name: '',
        address: null,
        status: '',
        facilities: []
    })

    useEffect(() => {
        data && setInitialValues({
            id: data.id,
            name: data.name,
            address: data.address,
            status: data.status,
            facilities: data.facilities
        })
    }, [data])

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            submit(values as Organization).then(() => {
                setSubmitting(false)
            })
        },
    });

    if (!data) {
        return <Loading/>
    }

    return (
        <div>
            {
                data.id && <OrganizationFacilitiesDialog
                    open={openOrganizationFacilitiesDialog}
                    onClose={() => setOpenOrganizationFacilitiesDialog(false)}
                    organizationId={data.id}
                />
            }
            {
                data.id && <OrganizationUsersDialog
                    open={openOrganizationUsersDialog}
                    organizationId={data.id}
                    onClose={() => setOpenOrganizationUsersDialog(false)}
                />
            }
            <Container maxWidth='lg'>
                <AlertNotification/>
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
                    {
                        formik.values.status !== '' &&
                            <FormControl fullWidth margin="normal" error={!!formik.errors.status}
                            >
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name={"status"}
                                    label="Status"
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
                    }
                </form>
                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                    style={{marginTop: "15px"}}
                >
                    {
                        account.accountType === AccountEnum.SYSTEM &&
                        <Button size={"large"}
                                color={"error"}
                                onClick={() => navigate("/organizations")}
                        >
                            Back
                        </Button>
                    }
                    <Button size={"large"}
                            fullWidth
                            disabled={!data.id}
                            onClick={() => setOpenOrganizationUsersDialog(true)}
                    >
                        Participants
                    </Button>
                    <Button size={"large"}
                            fullWidth
                            disabled={!data.id}
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
                        {formik.isSubmitting ? <CircularProgress size={24}/> : "Save"}
                    </Button>
                </Stack>
            </Container>
        </div>
    )

};

export default OrganizationForm;
