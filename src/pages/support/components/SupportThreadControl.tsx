import {SupportThread} from "../../../entities/SupportThread";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ThreadStatus} from "./ThreadStatus";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {useUpdateThread} from "../../../api/SupportApi";
import {getErrorMessage} from "../../../components/error/ResponseError";

export function SupportThreadControl({thread, message, sendMessage}: { thread: SupportThread, message:string, sendMessage:() => void }) {
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const account = authStore.account;
    const [confirmDone, setConfirmDone] = useState(false);

    const updateThread = useUpdateThread(thread.id, e => getErrorMessage("Failed to update thread status", e));

    const canDone = thread.status !== ThreadStatus.done
        && (thread.accountId === account.id || (account.accountType === AccountEnum.SYSTEM && thread.status === ThreadStatus.in_process));
    const canInProcess = (account.accountType === AccountEnum.SYSTEM && thread.status === ThreadStatus.open);

    return <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
        style={{paddingBottom: '15px'}}
    >
        <Button color={"primary"}
                variant="outlined"
                onClick={() => navigate("/support")}
        >
            Back
        </Button>

        {canInProcess && <Button type={"button"} color={"warning"}
                                 onClick={() => {
                                     updateThread.mutateAsync({...thread, status: ThreadStatus.in_process})
                                 }}
                variant="outlined">In progress</Button>}

        {canDone && <Button type={"button"} color={"success"}
                            onClick={() => {
                                setConfirmDone(true);
                            }}
                variant="outlined">Done</Button>}
        {confirmDone && <Dialog open={true}>
            <DialogTitle>Confirm following action</DialogTitle>
            <DialogContent>You are about to change status of current thread to "DONE"</DialogContent>
            <DialogActions>
                <Button type={"button"} variant={"outlined"} color={"error"} onClick={() => setConfirmDone(false)}>Cancel</Button>
                {message && <Button type={"button"} variant={"outlined"} onClick={() => {
                    setConfirmDone(false);
                    sendMessage();
                }}>Post message instead</Button>}
                <Button type={"button"} variant={"outlined"} color={"success"} onClick={() => updateThread.mutateAsync({...thread, status: ThreadStatus.done})
                    .then(() => navigate("/support"))}>Confirm</Button>
            </DialogActions>
        </Dialog>}
    </Stack>
}