import Table, {IColumnType} from "../table/Table";
import * as React from "react";
import {useMemo, useState} from "react";
import {Account} from "../../entities/account";
import {useDeleteRepresentative} from "../../api/RepresentativeApi";
import SkeletonTable from "../table/SkeletonTable";
import DeleteModal from "../modal/DeleteModal";

import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {IconButton, styled, Typography} from "@mui/material";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {find, findOrganizationId} from "../../util/MetadataUtil";
import {IPage} from "../../hooks/react-query";
import {Organization} from "../../entities/organization";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";

const Circle = styled('span')({
    height: 10,
    width: 10,
    display: 'inline-block',
    borderRadius: '50%',
    backgroundColor: 'black'
});


export interface IUserGridProps {
    data?: IPage<Account>;
    rowsPerPage: number;
    organizationId?: string;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    onPageNumberChange: (page: number) => void;
    applySort: (key:string, direction:string|undefined) => void
}

export const UserGrid: React.FC<IUserGridProps> = ({data, applySort, rowsPerPage, onRowsPerPageChange, onPageNumberChange}) => {
    const [representative, setRepresentative] = useState<Account>();
    const {authStore} = useRootStore();
    const { data: organizationsList } = useGetAllOrganizationList();
    const organizations = useMemo(() => {
        return organizationsList?.reduce((prev:Record<string, Organization>, current:Organization) => {
            prev[current.id] = current;
            return prev;
        }, {} as Record<string, Organization>)
    }, [organizationsList])
    
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

    const columns = useMemo(
        () => getColumns(applySort, authStore.account, organizations),
        [applySort, authStore.account, organizations]);

    return <>
        {data
            ? <Table
                columns={columns}
                page={data}
                onPageChange={onPageNumberChange}
                onRowsPerPageChange={onRowsPerPageChange} />
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

function getColumns(applySort:(key:string, direction:string|undefined) => void, account:Account, organizations?:Record<string, Organization>):IColumnType<Account>[] {
    const columns:IColumnType<Account>[] = [
        {
            key: 'firstName',
            title: 'First Name',
            sort: applySort
        },
        {
            key: 'lastName',
            title: 'Last Name',
            sort: applySort
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
    ];

    if(account.accountType !== AccountEnum.REPRESENTATIVE) {
        columns.push({
            key: 'organization',
            title: 'Organization',
            render: account => {
                if(!organizations) {
                    return '';
                }
                const orgId = findOrganizationId(account);
                if(!orgId) {
                    return '';
                }
                return organizations[orgId]?.name
            }
        });
    }

    columns.push(
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
        });

    return columns;
}