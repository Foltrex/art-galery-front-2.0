import * as React from "react";
import {useRef, useState} from "react";
import {SupportThread} from "../../entities/SupportThread";
import {ThreadStatus} from "./components/ThreadStatus";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {useCreateThread} from "../../api/SupportApi";
import {getErrorMessage} from "../../components/error/ResponseError";
import Bubble from "../../components/bubble/Bubble";
import {useNavigate} from "react-router-dom";
import {useSaveTempFile} from "../../api/FileApi";
import * as yup from "yup";
import {useFormik} from "formik";
import {Button, CircularProgress, Container, Stack, TextField} from "@mui/material";
import {SupportMediaFile} from "./components/SupportMediaFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {uploadTempFile} from "../../util/PrepareDataUtil";


export function NewThread () {
    const {authStore} = useRootStore();
    const account = authStore.account;
    const navigate = useNavigate();

    const createThread = useCreateThread((errror) => {
        getErrorMessage("Failed to create new thread", errror)
    });


    const [data, setData] = useState<SupportThread>({
        id: '',
        accountId: account.id,
        email: account.email,
        name: [account.firstName, account.lastName].filter(v => v).join(" "),
        subject: '',
        status: ThreadStatus.open,
        message: '',
        createdAt: new Date().getTime() + "",
        updatedAt: new Date().getTime() + "",
        files: [],
        posts: []
    })

    const fileInput = useRef<HTMLInputElement>(null);
    const saveFile = useSaveTempFile((e) => {
        getErrorMessage("Failed to upload file", e);
    });

    const validationShapeThread = yup.object().shape({
        name: yup.string()
            .required()
            .min(2)
            .max(255),
        email: yup.string()
            .email(),
        subject: yup.string()
            .required(),
        message: yup.string()
            .required()
    });


    const formik = useFormik({
        initialValues: data,
        validationSchema: validationShapeThread,
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            setSubmitting(true)
            return createThread.mutateAsync({...values, files: data.files})
                .then(() => {
                    navigate("/support");
                    Bubble.success("Our support agent will respond as soon as possible")
                })
                .catch(() => setSubmitting(false))
        },
    });


    return (
        <Container maxWidth='lg'>
            <form onSubmit={formik.handleSubmit} id="thread_add" noValidate>
                <Stack direction={{xs: 'column', md: 'row'}} gap={{md: '20px'}}>
                    <TextField
                        fullWidth={true}
                        margin="normal"
                        required
                        size={"small"}
                        label="Email"
                        name={"email"}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={!!formik.errors.email} helperText={formik.errors.email}
                    />
                    <TextField
                        fullWidth={true}
                        margin="normal"
                        size={"small"}
                        required
                        label={"Your Name"}
                        name={"name"}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={!!formik.errors.name} helperText={formik.errors.name}
                    />
                </Stack>
                <TextField
                    fullWidth={true}
                    margin="normal"
                    size={"small"}
                    required
                    label="Subject"
                    name={"subject"}
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={!!formik.errors.subject} helperText={formik.errors.subject}
                />
                <TextField
                    fullWidth={true}
                    minRows={5}
                    type={"textarea"}
                    multiline
                    margin="normal"
                    required
                    label="Message"
                    name={"message"}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    error={!!formik.errors.message} helperText={formik.errors.message}
                />

                {data.files?.map(file => {
                    return <SupportMediaFile key={file.id} fileId={file.id} originalName={file.originalName!}
                                             mimeType={file.mimeType}/>
                })}

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
                            onClick={() => navigate("/support")}
                    >
                        Back
                    </Button>

                    <Button size={"large"}
                            sx={{width: '25%'}}
                            fullWidth
                            startIcon={<UploadFileIcon/>}
                            color={"primary"}
                            variant="outlined"
                            onClick={() => {
                                fileInput!.current!.click()
                            }}
                    >
                        Upload file
                    </Button>

                    <Button size={"large"}
                            fullWidth
                            sx={{width: '25%'}}
                            color={"success"}
                            variant="outlined"
                            type="submit"
                            form={"thread_add"}
                            disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? <CircularProgress/> : "Create"}
                    </Button>
                </Stack>
            </form>

            <input
                type='file'
                ref={fileInput}
                onChange={e => uploadTempFile(e, saveFile).then(response => {
                    setData({...data, files: [...data.files, response.data]});
                })}
                style={{display: 'none'}}
            />

        </Container>)
}