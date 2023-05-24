import {useParams} from "react-router-dom";
import {getErrorMessage} from "../../components/error/ResponseError";
import Loading from "../../components/ui/Loading";
import Bubble from "../../components/bubble/Bubble";
import * as React from "react";
import {useEffect, useMemo, useRef} from "react";
import {useCreatePost, useGetThreadById} from "../../api/SupportApi";
import {Box, Button, Chip, Container, IconButton, List, Stack, TextField} from "@mui/material";
import {SupportPost} from "./components/SupportPost";
import {useFormik} from "formik";
import {Support} from "../../entities/SupportThread";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import * as yup from "yup";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {uploadTempFile} from "../../util/PrepareDataUtil";
import {useSaveTempFile} from "../../api/FileApi";
import {SupportThreadControl} from "./components/SupportThreadControl";
import {ThreadStatus, ThreadStatusComponent} from "./components/ThreadStatus";


export function EditThread () {
    const matches = useParams();

    const {authStore} = useRootStore();
    const account = authStore.account;
    const fileInput = useRef<HTMLInputElement>(null);

    const {data, isSuccess} = useGetThreadById(matches.id!, (error) => {
        getErrorMessage("Failed to load thread details", error);
    });

    const saveFile = useSaveTempFile((e) => {
        getErrorMessage("Failed to upload file", e);
    });

    const createPost = useCreatePost((errror) => {
        getErrorMessage("Failed to create new post", errror)
    });

    useEffect(() => {
        if(isSuccess) {
            scrollToBottom();
        }
    }, [isSuccess])


    const posts = useMemo(() => {
        if(!data || !data.posts || data.posts.length <= 1) {
            return []
        }
        const posts = [...data.posts];
        posts.shift();
        return posts;
    }, [data?.posts])

    const formik = useFormik<Support>({
        initialValues: {
            threadId: matches.id!,
            message: '',
            accountId: account.id,
            id: '',
            createdAt: '',
            type: 'TEXT'
        },
        validationSchema: yup.object().shape({}),
        validateOnChange: false,
        onSubmit: async (values, {setSubmitting}) => {
            const message = (values.message as string).trim();
            if(!message) {
                Bubble.error("Message can't be empty");
            }
            setSubmitting(true)
            return createPost.mutateAsync({...values, message: message})
                .then(() => {
                    setSubmitting(false)
                    formik.setFieldValue('message', '', true);
                    scrollToBottom();
                })
                .catch(() => setSubmitting(false))
        },
    });


    if(!data) {
        return <Loading />
    }
    const opPost = (data.posts || [])[0];
    const isDisabled = !(data.accountId === account.id || data.status === ThreadStatus.in_process);

    return <Container style={{background: '#eeeeee', borderRadius: '5px'}} maxWidth={'md'}>
        <Chip variant="outlined" style={{background: 'white', position: "fixed", padding: '10px', top: '80px', left: '50%', marginLeft: "-100px", zIndex: 20}} label={
            <Stack direction={"row"} alignItems={"center"}>
                Status:&nbsp;
                <ThreadStatusComponent status={data.status}/>
            </Stack>}/>
        <List style={{borderRadius: '3px', margin: '0 10px'}}>
            <SupportPost post={{
                id: opPost.id,
                accountId: opPost.accountId,
                threadId: data.id,
                message: <Box>
                    <strong>Name: </strong>&nbsp;{data.name}<br/>
                    <strong>Email: </strong>&nbsp;{data.email}<br/>
                    <strong>Subject: </strong>&nbsp;{data.subject}<br/>
                    <strong>Message: </strong>&nbsp;{opPost?.message}
                </Box>,
                type:'TEXT',
                createdAt: data.createdAt
            }} thread={data} showAvatar={true}/>
            {posts.map((post, index) =>
                <SupportPost key={post.id}
                             post={post}
                             thread={data}
                             showAvatar={(index === 0 ? opPost.accountId : data.posts[index].accountId) !== post.accountId}/>)}
        </List>
        <form onSubmit={formik.handleSubmit} id="thread_add" noValidate style={{paddingBottom: '15px'}}>
            <Stack
                style={{border: '1px solid #ccc', borderRadius: '3px', padding: '10px'}}
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
            >
                <IconButton disabled={isDisabled} onClick={() => {
                            fileInput!.current!.click()
                        }}
                >
                    <UploadFileIcon/>
                </IconButton>
                <TextField
                    fullWidth={true}
                    variant={"standard"}
                    disabled={isDisabled}
                    minRows={5}
                    style={{border: "none"}}
                    type={"textarea"}
                    multiline
                    margin="normal"
                    required
                    size={"small"}
                    label="Message"
                    name={"message"}
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    InputProps={{
                        disableUnderline: true,
                    }}
                    error={!!formik.errors.message} helperText={formik.errors.message}
                />
                <Button type={"submit"} variant={"text"} color={"inherit"}
                        disabled={isDisabled}>Send</Button>
            </Stack>
        </form>

        <SupportThreadControl thread={data} message={formik.values.message as string} sendMessage={() => {
            formik.submitForm();
        }} />

        <input
            type='file'
            ref={fileInput}
            onChange={e => uploadTempFile(e, saveFile).then(response => {
                return createPost.mutateAsync({
                    threadId: matches.id!,
                    message: response.data.id + ":" + response.data.mimeType + ":" + response.data.originalName,
                    accountId: account.id,
                    id: '',
                    createdAt: '',
                    type: 'MEDIA'
                }).then(() => scrollToBottom())
            })}
            style={{display: 'none'}}
        />
    </Container>
}

function scrollToBottom() {
    setTimeout(function() {
        document.documentElement.scroll({top: document.documentElement.scrollHeight, behavior: "smooth"})
    }, 100)

}