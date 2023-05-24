import {Link, useNavigate} from "react-router-dom";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import * as React from "react";
import {useState} from "react";
import {getErrorMessage} from "../../components/error/ResponseError";
import {Box, Button, FormControl, FormControlLabel, IconButton, Radio, RadioGroup} from "@mui/material";
import Table, {IColumnType} from "../../components/table/Table";
import SkeletonTable from "../../components/table/SkeletonTable";
import {ThreadStatus} from "./components/ThreadStatus";
import {useDeleteThread, useGetAllThreads} from "../../api/SupportApi";
import {SupportThread} from "../../entities/SupportThread";
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteModal from "../../components/modal/DeleteModal";

interface ThreadListProps {

}

export function ThreadList({}: ThreadListProps) {
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const account = authStore.account;

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);
    const [threadToDelete, setThreadToDelete] = React.useState<SupportThread>();

    const [status, setStatus] = useState<ThreadStatus>('' as ThreadStatus);

    const {data} = useGetAllThreads({
        page: pageNumber,
        size: rowsPerPage,
        sort: 'status,updatedAt',
        status: status,
    }, (error) => getErrorMessage("Failed to load threads list", error));

    const deleteThread = useDeleteThread(threadToDelete?.id, (e) => {
        getErrorMessage("Failed to delete thread", e);
    });

    const columns:IColumnType<SupportThread>[] = [
        {
            key: 'name',
            title: 'Name',
        },
        {
            key: 'email',
            title: 'Email',
        },
        {
            key: 'subject',
            title: 'Subject',
        },
        {
            key: 'message',
            title: 'Message',
            render: s => {
                if(!s.posts || !s.posts.length) {
                    return '';
                }
                return s.posts[0].message;
            }
        },
        {
            key: 'status',
            title: 'Status',
            render: (s) => {
                switch (s.status) {
                    case ThreadStatus.open:
                        return <SmsFailedOutlinedIcon color={"warning"}/>
                    case ThreadStatus.in_process:
                        return <AssignmentIndOutlinedIcon color={"info"}/>
                    case ThreadStatus.done:
                        return <TaskAltOutlinedIcon color={"success"}/>
                    default:
                        return <QuestionMarkOutlinedIcon color={"error"} />
                }
            }
        },
        {
            key: 'control',
            title: " ",
            render: s => {
                return <Box>
                    <IconButton size={"small"} onClick={() => {
                        navigate("/support/" + s.id)
                    }}>
                        <EditOutlined />
                    </IconButton>

                    {s.accountId === account.id && <IconButton size={"small"}  onClick={() => {
                        setThreadToDelete(s);
                    }}><DeleteOutlineOutlinedIcon/></IconButton>}
                </Box>
            }
        }
    ]


    return (
        <>
            <Box sx={{display: 'flex', gap: '20px'}}>
                <FormControl>
                    <RadioGroup
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        row
                    >
                        <FormControlLabel
                            control={<Radio size='small'/>}
                            value={''}
                            label={"All"}/>
                        <FormControlLabel
                            control={<Radio size='small'/>}
                            value={ThreadStatus.open}
                            label={"Open"}/>
                        <FormControlLabel
                            control={<Radio size='small'/>}
                            value={ThreadStatus.done}
                            label={"Done"}/>
                        <FormControlLabel
                            control={<Radio size='small'/>}
                            value={ThreadStatus.in_process}
                            label={"In process"}/>
                    </RadioGroup>
                </FormControl>
                <FormControl style={{marginLeft: "auto"}}>
                    <Link to={"/support/new"}>
                        <Button variant="text" size={"large"}>New Thread</Button>
                    </Link>
                </FormControl>
            </Box>

            {data && data.content
                ? <Table
                    columns={columns}
                    page={data}
                    onPageChange={setPageNumber}
                    onRowsPerPageChange={setRowsPerPage}
                />
                : <SkeletonTable
                    columns={columns}
                    rowsPerPage={rowsPerPage}/>
            }
            {threadToDelete && <DeleteModal
                contextText={"You are about to delete your help request. Please confirm that action, because it is irreversible and cannot be undone."}
                    open={true}
                    onClose={() => setThreadToDelete(undefined)}
                    onDelete={() => {
                        deleteThread.mutateAsync('');
                    }} />}
        </>
    );
}