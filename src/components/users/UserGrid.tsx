import Table, { IColumnType } from "../table/Table";
import * as React from "react";
import { useState } from "react";
import { Account } from "../../entities/account";
import { useDeleteRepresentative } from "../../api/RepresentativeApi";
import SkeletonTable from "../table/SkeletonTable";
import RepresentativeForm from "../../pages/users/RepresentativeForm";
import DeleteModal from "../modal/DeleteModal";
import { useGetAll } from "../../api/AccountApi";

import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { IconButton, Typography, styled } from "@mui/material";
import { AccountEnum } from "../../entities/enums/AccountEnum";
import { TokenService } from "../../services/TokenService";
import { find } from "../../util/MetadataUtil";

function renderName(a: Account) {
    const fn = a.firstName;
    const ln = a.lastName;
    return (fn ? fn : "") + (fn && ln ? " " + ln : "");
}

const Circle = styled('span')({
    height: 10,
    width: 10,
    display: 'inline-block',
    borderRadius: '50%',
    backgroundColor: 'black'
});

const columns: IColumnType<Account>[] = [
    {
        key: 'firstname',
        title: 'First Name'
    },
    {
        key: 'lastname',
        title: 'Last Name',
        render: (a) => renderName(a)
    },
    {
        key: 'status',
        title: 'Status',
        render: (a) => {
            return !!a.blockedSince
                ? <Circle sx={{backgroundColor: 'error.main'}} />
                : <Circle sx={{backgroundColor: 'success.main'}} />;
        }
    },
    {
        key: 'account_type',
        title: 'Account Type',
        render: (a) => {
            switch (a.accountType) {
                case AccountEnum.ARTIST: {
                    return <Typography color='info.dark'>Artist</Typography>;
                }
                case AccountEnum.REPRESENTATIVE: {
                    return <Typography color='warning.dark'>Representative</Typography>;
                }
                case AccountEnum.SYSTEM: {
                    return <Typography color='success.dark'>System</Typography>
                }
            }
        }
    },
    {
        key: 'role',
        title: 'Role',
        render: (account) => find('organization_role', account) ?? 'None'
    },
    {
        key: 'actions',
        title: '',
        render: (account) => {
            return (
                <>
                    <IconButton
                        disableRipple
                        aria-label='edit'
                        onClick={() => { }}
                    >
                        <ModeOutlinedIcon />
                    </IconButton>
                    <IconButton
                        disableRipple
                        aria-label='delete'
                        onClick={() => { }}
                    >
                        <DeleteOutlinedIcon />
                    </IconButton>
                </>
            );
        }
    }
];

export const UserGrid = () => {

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);
    const [representative, setRepresentative] = useState<Account>();
    const { data } = useGetAll({ page: pageNumber, size: rowsPerPage });
    
    
    const mutationDelete = useDeleteRepresentative();
    const onDelete = async () => {
        try {
            await mutationDelete.mutateAsync(representative!.id);
        } catch (e) {
            // add push notification
            console.log(e);
        }
    }

    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = (data: Account) => {
        setRepresentative(data);
        setOpenDeleteModal(true);
    }

    const handleEdit = (data: Account) => {
        setRepresentative(data);
        setOpenEditForm(true);
    }


    return <>
        {data
            ? <Table
                columns={columns}
                onDelete={handleDelete}
                onEdit={handleEdit}
                page={data}
                onPageChange={(_, page) => setPageNumber(page)}
                onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)} />
            : <SkeletonTable
                columns={columns}
                rowsPerPage={rowsPerPage} />
        }

        {/* <RepresentativeForm
            open={openEditForm}
            onClose={() => setOpenEditForm(false)}
            representative={representative} /> */}
        <DeleteModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onDelete={onDelete} />
    </>
}