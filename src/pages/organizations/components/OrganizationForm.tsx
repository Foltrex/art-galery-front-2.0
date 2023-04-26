import {
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Tooltip
} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Loading from '../../../components/ui/Loading';
import {OrganizationStatusEnum} from '../../../entities/enums/organizationStatusEnum';
import {useNavigate} from "react-router-dom";
import MapDialog from "../../../components/map/MapDialog";
import {Address} from "../../../entities/address";
import * as yup from "yup";
import {useFormik} from "formik";
import {Organization} from "../../../entities/organization";
import OrganizationFacilitiesDialog from "./OrganizationFacilitiesDialog";
import OrganizationUsersDialog from "./OrganizationUsersDialog";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface IAppProps {
    data?: Organization;
    submit: (org: Organization) => Promise<boolean>
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
            .nullable()
    })

    const [initialValues, setInitialValues] = useState<Organization>({
        id: '',
        name: '',
        address: null,
        status: OrganizationStatusEnum.ACTIVE,
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
                data.id && openOrganizationFacilitiesDialog && <OrganizationFacilitiesDialog
                    open={true}
                    onClose={() => setOpenOrganizationFacilitiesDialog(false)}
                    organizationId={data.id}
                />
            }
            {
                data.id && openOrganizationUsersDialog && <OrganizationUsersDialog
                    open={true}
                    organizationId={data.id}
                    onClose={() => setOpenOrganizationUsersDialog(false)}
                />
            }
            <Container maxWidth='lg'>
                <form onSubmit={formik.handleSubmit} id="form" noValidate>
                    {openMap && <MapDialog
                        open={true}
                        onClose={() => setOpenMap(false)}
                        setFieldValue={(value: Address) => {
                            formik.setFieldValue('address', value)
                        }}
                        address={formik.values.address as Address}
                    />}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name={"name"}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={!!formik.errors.name} helperText={formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Address"
                        name={"address.name"}
                        InputProps={{readOnly: true}}
                        InputLabelProps={formik.values.address === null ? undefined : {shrink: true}}
                        value={formik.values.address?.name}
                        onClick={() => setOpenMap(true)}
                        onChange={(e) => formik.handleChange(e)}
                        error={!!formik.errors.address} helperText={formik.errors.address}
                    />

                    <FormControlLabel className={"switch-control"} control={
                        <Switch
                            size={"medium"}
                            name={"status"}
                            checked={formik.values.status === OrganizationStatusEnum.ACTIVE}
                            onChange={() => formik.setFieldValue("status", formik.values.status === OrganizationStatusEnum.ACTIVE
                                ? OrganizationStatusEnum.INACTIVE
                                : OrganizationStatusEnum.ACTIVE)}
                        />
                    } label={<span style={{display: 'flex'}}>Status <Tooltip title={"Only active organizations are shown in the catalog"}><HelpOutlineIcon color={"info"}/></Tooltip></span>} />
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
                                color={"primary"}
                                variant={"outlined"}
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
