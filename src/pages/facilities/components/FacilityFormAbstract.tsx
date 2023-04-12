import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import * as React from "react";
import {ChangeEvent, useRef, useState} from "react";
import {useSaveFile} from "../../../api/FileApi";
import {FileService} from "../../../services/FileService";
import * as yup from "yup";
import {useFormik} from "formik";
import {Facility} from "../../../entities/facility";
import MapDialog from "../../../components/map/MapDialog";
import {Address} from "../../../entities/address";
import {Button, CircularProgress, Divider, FormControlLabel, FormGroup, Stack, Switch, TextField} from "@mui/material";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {OrganizationsFilter} from "../../../components/form/OrganizationsFilter";
import {findOrganizationId} from "../../../util/MetadataUtil";


export const FacilityFormAbstract = (props:{data: Facility, back: () => void, onSubmit:(facility:Facility) => Promise<boolean>}) => {
    const {authStore} = useRootStore();
    const account = authStore.account;
    const organizationId = (account.accountType === AccountEnum.REPRESENTATIVE
        ? findOrganizationId(account)
        : props.data.organization?.id) as string;


    const [openMap, setOpenMap] = useState(false)

    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const mutationSaveImage = useSaveFile();

    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;

        const file = fileList[0];
        setFiles([...files, file]);

        const image = await FileService.toBase64fromBlob(file);
        setImages([...images, image]);
    }

    // const handleSubmit = async (art: Art) => {
    //     const response = await mutationSaveArt.mutateAsync(art);
    //     const { data: persistedArt } = response;
    //     const { id: artId } = persistedArt;
    //
    //     const promises = files.map(async (file) => {
    //         console.log(art.id)
    //         const fileEntity = await FileService.toFile(artId!, file);
    //         await mutationSaveImage.mutateAsync(fileEntity);
    //     })
    //     await Promise.all(promises);
    //
    //     navigate(`/arts/artist/${artId}`);
    // }

    const validationShape = {
        name: yup.string()
            .required()
            .min(2)
            .max(255),
        address: yup.object()
            .required()
            .nullable(),
    };
    if(account.accountType === AccountEnum.SYSTEM) {
        //@ts-ignore
        validationShape.organization = yup.object({
            id: yup.string().required("Please select organization")
        });
    }
    const validationSchema = yup.object().shape(validationShape)

    const formik = useFormik({
        initialValues: {...props.data, organization: {...props.data.organization, id: organizationId}},
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        },
    });

    const submit = async (values: Facility) => {
        values.id = props.data.id || '';
        values.organization.id = values.organization.id || organizationId || '';
        props.onSubmit(values)
    }

    console.log(formik)

    //@ts-ignore
    return (<form onSubmit={formik.handleSubmit} id="facility_add_edit" noValidate>
            <MapDialog
                open={openMap}
                onClose={() => setOpenMap(false)}
                setFieldValue={(value: Address) => {
                    formik.setFieldValue('address', value)
                }}
                address={formik.values.address as Address}
            />
            <TextField
                fullWidth={true}
                margin="normal"
                size={"small"}
                required
                label="Name"
                name={"name"}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={!!formik.errors.name} helperText={formik.errors.name}
            />

            {/*@ts-ignore*/}
            {account.accountType === AccountEnum.SYSTEM
                && <OrganizationsFilter error={formik.errors.organization?.id}
                                        setOrganizationId={(s) => formik.setFieldValue('organization.id', s, true)}/>}
            <TextField
                fullWidth={true}
                margin="normal"
                size={"small"}
                required
                label="Address"
                name={"address"}
                InputProps={{readOnly: true}}
                InputLabelProps={formik.values.address === null ? undefined : {shrink: true}}
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
                        name={"isActive"}
                        checked={formik.values.isActive as boolean}
                        onChange={formik.handleChange}
                    />
                } label="isActive"/>
            </FormGroup>

            <Stack
                direction={"row"}
                spacing={2}
                divider={<Divider orientation="vertical" flexItem/>}
                style={{marginTop: "15px"}}
            >
                <Button size={"large"}
                        color={"error"}
                        variant="outlined"
                        onClick={props.back}
                >
                    Back
                </Button>
                <Button size={"large"}
                        color={"success"}
                        variant="outlined"
                        type="submit" form={"facility_add_edit"} disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? <CircularProgress/> : "Save"}
                </Button>
            </Stack>
        </form>)
}