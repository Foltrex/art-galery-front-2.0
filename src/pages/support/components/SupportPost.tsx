import {Support, SupportThread} from "../../../entities/SupportThread";
import {Box, ListItemAvatar, Stack} from "@mui/material";
import {SupportMediaFile} from "./SupportMediaFile";
import {useMemo} from "react";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import LetterAvatar from "../../../components/ui/LetterAvatar";
import {Account} from "../../../entities/account";
import {useGetAccountById} from "../../../api/AccountApi";
import {getErrorMessage} from "../../../components/error/ResponseError";
import {ThreadStatus, ThreadStatusComponent} from "./ThreadStatus";

interface SupportPostProps {
    post: Support
    thread: SupportThread
    showAvatar: boolean
}


export function SupportPost({post, thread, showAvatar}: SupportPostProps) {
    const {authStore} = useRootStore();
    const account = authStore.account;

    const {data} = useGetAccountById(post.accountId, (e) => {
        getErrorMessage("Failed to load account information", e);
    });

    const content = useMemo(() => {
        if (post.type === 'TEXT') {
            return <Box>{post.message}</Box>;
        } else if(post.type === 'SYSTEM') {
            const parts = (post.message as string).split(":")
            return parts[0] === 'STATUS_CHANGE'
                ? <Stack direction={"row"} alignItems={"center"}>Status changed to&nbsp;<ThreadStatusComponent status={parts[1] as ThreadStatus}/></Stack>
                : "[unknown system message]";
        } else {
            const parts = (post.message as string).split(":");
            return <SupportMediaFile fileId={parts[0]} mimeType={parts[1]} originalName={parts[2]}/>
        }
    }, [post])

    const thisAccount = useMemo<Account>(() => {
        const threadOwner = post.accountId === thread.accountId;
        return {
            id: post.accountId,
            email: threadOwner ? thread.email : data?.email!,
            firstName: threadOwner ? thread.name : data?.firstName!,
            lastName: threadOwner ? "" : data?.lastName!,
            accountType: data?.accountType!,
            metadata: data?.metadata!,
            blockedSince: new Date()
        }
    }, [post, data])

    return <Stack
            style={{marginBottom: '15px'}}
            direction={post.accountId === account.id ? "row-reverse" : "row"}
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={'10px'}
        >
        <ListItemAvatar>
            {showAvatar && <LetterAvatar account={thisAccount}/>}
        </ListItemAvatar>
        <div style={{background: "white", padding: '10px 15px', borderRadius: '3px', whiteSpace: "pre-wrap"}}>{content}</div>
    </Stack>
}
