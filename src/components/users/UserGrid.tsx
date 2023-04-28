import Table, {IColumnType} from "../table/Table";
import * as React from "react";
import {useMemo, useState} from "react";
import {Account} from "../../entities/account";
import SkeletonTable from "../table/SkeletonTable";
import DeleteModal from "../modal/DeleteModal";

import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Avatar, IconButton, Stack, styled, Typography} from "@mui/material";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {find, findOrganizationId, isCreatorOrAdmin} from "../../util/MetadataUtil";
import {IPage} from "../../hooks/react-query";
import {Organization} from "../../entities/organization";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useDeleteAccountById} from "../../api/AccountApi";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {buildImageUrl} from "../../util/PrepareDataUtil";

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
    applySort: (key:string, direction:string|undefined) => void;
    editUser?: (userId:string) => void
}

export const UserGrid: React.FC<IUserGridProps> = ({data, applySort, editUser, rowsPerPage, onRowsPerPageChange, onPageNumberChange}) => {
    const [user, setUser] = useState<Account>();
    const {authStore} = useRootStore();
    const navigate = useNavigate();
    const { data: organizationsList } = useGetAllOrganizationList();
    const organizations = useMemo(() => {
        return organizationsList?.reduce((prev:Record<string, Organization>, current:Organization) => {
            prev[current.id] = current;
            return prev;
        }, {} as Record<string, Organization>)
    }, [organizationsList])
    

    const mutationDelete = useDeleteAccountById();
    const onDelete = async () => {
        await mutationDelete.mutateAsync(user!.id);
    }

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = (data: Account) => {
        setUser(data);
        setOpenDeleteModal(true);
    }


    const columns = useMemo(
        () => getColumns(applySort, authStore.account, navigate, handleDelete, organizations, editUser),
        [applySort, authStore.account, navigate, handleDelete, organizations, editUser]);

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
            onDelete={onDelete}
            contextText={`You are about to delete ${user?.firstName} ${user?.lastName} account. All related data will be lost, and that action can not be undone. Are you sure to proceed?`}
        />
    </>
}

function AccountImage ({account}:{account:Account}) {
    const image = useMemo(() => {
        const image = find(MetadataEnum.ACCOUNT_IMAGE, account);
        if(!image) {
            return '';
        }
        return buildImageUrl(image);
    }, [account])
    return <Stack alignItems={"center"}>{image ? <Avatar src={image} alt={'ava'}/> : null}</Stack>
}

function getColumns(
    applySort: (key: string, direction: (string | undefined)) => void,
    account: Account,
    navigate: NavigateFunction,
    onDelete: (account: Account) => void,
    organizations?: Record<string, Organization>,
    editUser?: ((userId: string) => void)
    ):IColumnType<Account>[] {
    const columns:IColumnType<Account>[] = [
        {
            key: 'avatar',
            title: 'Profile image',
            render: (a) => <AccountImage account={a}/>
        },
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

    if(account.accountType !== AccountEnum.REPRESENTATIVE || isCreatorOrAdmin(account)) {
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
                            onClick={() => {editUser ? editUser(account.id) : navigate("/users/" + account.id)}}
                        >
                            <ModeOutlinedIcon />
                        </IconButton>
                        <IconButton
                            disableRipple
                            aria-label='delete'
                            onClick={() => onDelete(account)}
                        >
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </>
                );
            }
        });

    return columns;
}