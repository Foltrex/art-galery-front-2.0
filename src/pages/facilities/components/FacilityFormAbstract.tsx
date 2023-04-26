import {AddAPhoto} from "@mui/icons-material";
import {
    Button,
    CircularProgress,
    Container,
    FormControlLabel,
    FormGroup,
    IconButton,
    Stack,
    styled,
    Switch,
    TextField,
    Tooltip
} from "@mui/material";
import {useFormik} from "formik";
import * as React from "react";
import {ChangeEvent, useRef, useState} from "react";
import * as yup from "yup";
import {useGetAllEntityFilesByEntityId, useUploadFile} from "../../../api/FileApi";
import {OrganizationsDropdown} from "../../../components/form/OrganizationsDropdown";
import MapDialog from "../../../components/map/MapDialog";
import ImageSlider from "../../../components/ui/ImageSlider";
import {Address} from "../../../entities/address";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {Facility} from "../../../entities/facility";
import {FileService} from "../../../services/FileService";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {findOrganizationId} from "../../../util/MetadataUtil";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import {buildImageUrl} from "../../../util/PrepareDataUtil";

interface ImageFrameProps {
    showBorder?: boolean;
}

const ImageFrame = styled('div', {
    shouldForwardProp: (prop) => prop !== 'showBorder',
    overridesResolver: (props, styles) => [ styles.root ],

})<ImageFrameProps>(({ showBorder = true }) => ({
    border: showBorder ? '1px solid' : 'none',
    display: 'block',
    position: 'relative',
    width: 400,
    height: 300,
    borderRadius: 2,
    marginLeft: '50%',
    transform: 'translate(-50%, 0)',
    textAlign: 'center'
}))

const AddImageButton = styled(IconButton)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
})

export const FacilityFormAbstract = (props: { data: Facility, back: () => void, onSubmit: (facility: Facility) => Promise<boolean> }) => {
    const { authStore } = useRootStore();
    const account = authStore.account;
    const organizationId = (account.accountType === AccountEnum.REPRESENTATIVE
        ? findOrganizationId(account)
        : props.data.organizationId) as string;


    const [openMap, setOpenMap] = useState(false)

    const fileInput = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);

    const {data: fileEntities = []} = useGetAllEntityFilesByEntityId(props.data?.id);
    const facilityImages:string[] = fileEntities
        .filter(fileEntity => fileEntity.id && fileEntity.type === EntityFileTypeEnum.ORIGINAL)
        .map(fileEntity => buildImageUrl(fileEntity.id!));


    // TODO: BUG WITH: const [images, setImages] = useState<string[]>(facilityImages);
    // const [images, setImages] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    
    // useEffect(() => {
    //     if (facilityImages) {
    //         setImages(_.union(images, facilityImages));
    //     }
    // }, [images])

    const mutationUploadImage = useUploadFile();

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
    if (account.accountType === AccountEnum.SYSTEM) {
        //@ts-ignore
        validationShape.organizationId = yup.string().required("Please select organization");
    }
    const validationSchema = yup.object().shape(validationShape)

    const formik = useFormik({
        initialValues: { ...props.data, organizationId: organizationId },
        validationSchema: validationSchema,
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            await submit(values)
            setSubmitting(false)
        },
    });

    const submit = async (values: Facility) => {
        console.log("on submit")
        values.id = props.data.id || '';
        values.organizationId = values.organizationId || organizationId || '';
        props.onSubmit(values).then(() => {
            const entityId = values.id;
            if (entityId) {
                const promises = files.map(async (file) => {
                    console.log(entityId)
                    const fileEntity = await FileService.toEntityFile(entityId, file);
                    await mutationUploadImage.mutateAsync(fileEntity);
                })
                return Promise.all(promises);
            }
        });
    }
    
    const renderImageSlider = () => {
        if (facilityImages.length > 0) {
            return (
                <ImageFrame showBorder={false} sx={{ mb: 10 }}>
                    <ImageSlider slides={facilityImages} showLoadMore={false} showMakeMain={false} />
                </ImageFrame>
            );
        } else if (images.length > 0) {
            return (
                <ImageFrame showBorder={false} sx={{ mb: 10 }}>
                    <ImageSlider slides={images} showLoadMore={false} showMakeMain={false} />
                </ImageFrame>
            );
        } else {
            return (
                <ImageFrame>
                    <AddImageButton onClick={() => fileInput.current?.click()}>
                        <AddAPhoto />
                    </AddImageButton>
                    <input
                        style={{
                            display: 'none'
                        }}
                        type='file'
                        ref={fileInput}
                        onChange={handleFileInputChange}
                    />
                </ImageFrame>
            )
        }
    }

    return (
        <Container maxWidth='lg'>
            {renderImageSlider()}
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