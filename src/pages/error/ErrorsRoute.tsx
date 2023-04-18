import Table, {IColumnType} from "../../components/table/Table";
import {useGetAll} from "../../api/ErrorsApi";
import Loading from "../../components/ui/Loading";
import * as React from "react";
import {useMemo, useState} from "react";
import {UiError} from "../../entities/uiError";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    Tooltip,
    Typography
} from "@mui/material";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import Bubble from "../../components/bubble/Bubble";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';


const ShortText = ({text}:{text?:string}) => {
    const content = useMemo(() => {
        const t = (text || '[empty]');
        return t.length > 15 ? t.substring(0, 12) + '...' : t.length;
    }, [text])

    if(text && text.length > 15) {
        return <Tooltip title={<pre>{text}</pre>}><div>{content}</div></Tooltip>
    } else {
        return <pre>{content}</pre>
    }
}

const overflow = {maxHeight: 600, overflow: "auto"};
const bold = {fontWeight: 'bold'}
const statusStyle = {justifyContent: 'center', padding: 0, cursor: 'pointer'};

export const ErrorsRoute = () => {
    const [update, setUpdate] = useState<boolean>(false);
    const [status, setStatus] = useState<string>();
    const [page, onPageChange] = useState<number>(0);
    const [size, onRowsPerPageChange] = useState<number>(25);
    const [error, setError] = useState<UiError>();
    const alterStatus = (uiError:UiError) => {
        uiError.status = uiError.status === 'OPEN' ? 'FIXED' : (uiError.status === 'FIXED' ? 'NOT_REPRODUCIBLE' : 'OPEN');
        axiosApi.put(ART_SERVICE + "/errors/" + uiError.id, uiError)
            .then(() => setUpdate(!update))
            .catch(() => {
                Bubble.error("Failed to update record");
            });
    }
    const {data} = useGetAll({
        page: page,
        size: size,
        status: status,
        sort: 'createdAt,desc',
        update
    });

    const columns: IColumnType<UiError>[] = [
        {
            key: 'createdAt',
            title: 'Reported at'
        },
        {
            key: 'status',
            title: 'Status',
            render: (error) => {
                if(error.id === 7) {
                    console.log(error.status);
                }
                switch (error.status) {
                    case 'OPEN':
                        return <Alert icon={false} style={statusStyle} onClick={() => {alterStatus(error)}} severity={"error"}>{error.status}</Alert>
                    case 'FIXED':
                        return <Alert icon={false} style={statusStyle} onClick={() => {alterStatus(error)}} severity={"success"}>{error.status}</Alert>
                    case 'NOT_REPRODUCIBLE':
                        return <Alert icon={false} style={statusStyle} onClick={() => {alterStatus(error)}} severity={"warning"}>{error.status}</Alert>
                    default:
                        return <Alert icon={false} style={statusStyle} onClick={() => {alterStatus(error)}} severity={"warning"}>{error.status}</Alert>
                }
            }
        },
        {
            key: 'userId',
            title: 'User ID'
        },
        {
            key: 'url',
            title: 'URL'
        },
        {
            key: 'errorName',
            title: 'Error Name'
        },
        {
            key: 'errorMessage',
            title: 'Error Message',
            render: error => <ShortText text={error.errorMessage}/>
        },
        {
            key: 'errorTrace',
            title: 'Error Trace',
            render: error => <ShortText text={error.errorTrace}/>
        },
        {
            key: 'componentStack',
            title: 'Component Stack',
            render: error => <ShortText text={error.componentStack}/>
        },
        {
            key: 'view',
            title: '',
            render: error => <VisibilityOutlinedIcon onClick={() => setError(error)}/>
        }
    ]

    return <>
        <RadioGroup value={status} row
            onChange={(e) => setStatus(e.target.value)}>
                <FormControlLabel
                    control={<Radio size='small'/>}
                    value={''}
                    label={'All'}/>
                <FormControlLabel
                    control={<Radio size='small'/>}
                    value={'OPEN'}
                    label={'Open'}/>
                <FormControlLabel
                    control={<Radio size='small'/>}
                    value={'FIXED'}
                    label={'Fixed'}/>
                <FormControlLabel
                    control={<Radio size='small'/>}
                    value={'NOT_REPRODUCIBLE'}
                    label={'Not reproducible'}/>
        </RadioGroup>
        {data
            ? <Table columns={columns} page={data} onPageChange={onPageChange} onRowsPerPageChange={onRowsPerPageChange}/>
            : <Loading/>}

        {error && <Dialog open={true}
                          maxWidth='lg'
                          fullWidth >
            <DialogContent>
                <Typography>Error Name: {error.errorName}</Typography>
                <Typography sx={bold}>Message: </Typography>
                {error.errorMessage}
                <Typography sx={bold}>Date: </Typography>
                {error.createdAt}
                <Typography sx={bold}>User ID: </Typography>
                {error.userId}
                <Typography sx={bold}>Stack trace: </Typography>
                {error.errorTrace}
                <Typography sx={bold}>Component stack: </Typography>
                {error.componentStack}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' type='submit' onClick={() => setError(undefined)}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>}
    </>
}