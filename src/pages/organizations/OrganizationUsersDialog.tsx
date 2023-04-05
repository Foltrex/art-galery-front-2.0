import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton} from "@mui/material";
import {IPage} from "../../hooks/react-query";
import {ART_SERVICE, axiosApi, USER_SERVICE} from "../../http/axios";
import {useNavigate, useParams} from "react-router-dom";
import {Facility} from "../../entities/facility";
import SkeletonTable from "../../components/table/SkeletonTable";
import Table, {IColumnType} from '../../components/table/Table';
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import {DeleteOutline} from "@mui/icons-material";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {Account} from "../../entities/account";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
}

const OrganizationFacilitiesDialog = ({open, onClose}: IOrganizationFacilitiesDialogProps) => {
    const navigate = useNavigate()
    const matches = useParams();

    const [accounts, setAccounts] = useState<IPage<Account>>();
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    useEffect(() => {
        axiosApi.get(`${USER_SERVICE}/accounts/organizations/${matches.id}`, {
            params: {
                page: pageNumber,
                size: rowsPerPage,
            }
        }).then(response => {
            setAccounts(response.data)
        })
    }, [rowsPerPage, pageNumber])


    const handleDelete = async (data: Account) => {
        alert(data.firstName)
    }

    const handleEdit = (data: Account) => {
        // navigate(`/facilities/${data.id}`)
        alert(data.firstName)
    }

    const columns = getColumns(
        handleEdit,
        handleDelete,
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
            <DialogTitle>Organization's facilities</DialogTitle>
            <Divider/>
            <DialogContent>
                {accounts && accounts.content
                    ? <Table
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        page={accounts}
                        onPageChange={(e, page) => setPageNumber(page)}
                        onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
                    />
                    : <SkeletonTable
                        columns={columns}
                        rowsPerPage={rowsPerPage}/>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

function getColumns(onEdit: (data: Account) => void, onDelete: (data: Account) => void): IColumnType<Account>[] {

    return [
        {
            key: 'firstName',
            title: 'FirsNname',
            minWidth: 150
        },
        {
            key: 'lastName',
            title: 'LastName',
            minWidth: 150,
        },
        {
            key: 'email',
            title: 'Email',
            minWidth: 150,
        },
        {
            key: 'role',
            title: 'Role',
            minWidth: 150,
            render: (account) => {
                return (
                    <span>
                        {PrepareDataUtil.convertFirstLatterToUpperCase
                        (account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)!.value)}
                    </span>
                )
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            minWidth: 150,
            render: (organization) => {
                return (
                    <div>
                        <IconButton
                            disableRipple
                            aria-label='edit'
                            onClick={() => onEdit(organization)}
                        >
                            <ModeOutlinedIcon/>
                        </IconButton>
                        <IconButton
                            disableRipple
                            aria-label='delete'
                            onClick={() => onDelete(organization)}
                        >
                            <DeleteOutline/>
                        </IconButton>
                        {' '}
                    </div>
                )
            }
        }
    ];
}

export default OrganizationFacilitiesDialog;
