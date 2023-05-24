import Table, {IColumnType} from "../table/Table";
import * as React from "react";
import {useMemo, useState} from "react";
import {Account} from "../../entities/account";
import SkeletonTable from "../table/SkeletonTable";
import DeleteModal from "../modal/DeleteModal";

import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    styled,
    Typography
} from "@mui/material";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {find, findOrganizationId} from "../../util/MetadataUtil";
import {IPage} from "../../hooks/react-query";
import {Organization} from "../../entities/organization";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {impersonateAction, useDeleteAccountById} from "../../api/AccountApi";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {buildImageUrl} from "../../util/PrepareDataUtil";
import {OrganizationRoleEnum, roleToString} from "../../entities/enums/organizationRoleEnum";
import {getErrorMessage} from "../error/ResponseError";
import LoginIcon from '@mui/icons-material/Login';
import {AuthService} from "../../services/AuthService";

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
    applySort: (key: string, direction: string | undefined) => void;
    editUser?: (userId: string) => void
}

export const UserGrid: React.FC<IUserGridProps> = ({
                                                       data,
                                                       applySort,
                                                       editUser,
                                                       rowsPerPage,
                                                       onRowsPerPageChange,
                                                       onPageNumberChange
                                                   }) => {
    const [user, setUser] = useState<Account>();
    const [impersonate, setImpersonate] = useState<Account>();
    const {authStore} = useRootStore();
    const navigate = useNavigate();
    const {data: organizationsList} = useGetAllOrganizationList((e) => {
        getErrorMessage("Failed to load organizations list", e);
    });
    const organizations = useMemo(() => {
        return organizationsList?.reduce((prev: Record<string, Organization>, current: Organization) => {
            prev[current.id] = current;
            return prev;
        }, {} as Record<string, Organization>)
    }, [organizationsList])

    const mutationDelete = useDeleteAccountById((e) => {
        getErrorMessage("Failed to delete account information", e);
    });
    const onDelete = async () => {
        await mutationDelete.mutateAsync(user!.id);
    }

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = (data: Account) => {
        setUser(data);
        setOpenDeleteModal(true);
    }


    const columns = useMemo(
        () => getColumns(applySort, authStore.account, navigate, handleDelete, setImpersonate, organizations, editUser),
        [applySort, authStore.account, navigate, handleDelete, setImpersonate, organizations, editUser]);

    return <>
        {data
            ? <Table
                columns={columns}
                page={data}
                onPageChange={onPageNumberChange}
                onRowsPerPageChange={onRowsPerPageChange}/>
            : <SkeletonTable
                columns={columns}
                rowsPerPage={rowsPerPage}/>
        }
        {impersonate && <Dialog
            open={true}
            onClose={() => setImpersonate(undefined)}>
            <DialogTitle>Impersonate</DialogTitle>
            <DialogContent>You are about to impersonate <strong>{impersonate.firstName} {impersonate.lastName}</strong>.
                &nbsp;Current session will be replaced with the new one, and you will act as selected person.
                &nbsp;Please confirm your intentions.</DialogContent>
            <DialogActions>
                <Button variant={"outlined"} color={"error"} onClick={() => setImpersonate(undefined)}>Cancel</Button>
                <Button variant={"outlined"} color={"success"} onClick={() =>
                    impersonateAction({username:impersonate?.email}, (e) => {
                        return getErrorMessage("Failed to impersonate", e)
                    })
                    .then((e) => {
                        if(!e) {
                            return;
                        }
                        AuthService.setToken(e.data.token);
                        console.log(e);
                        document.location.reload()
                    })
                }>Confirm</Button>
            </DialogActions>
        </Dialog>}
        <DeleteModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onDelete={onDelete}
            contextText={`You are about to delete ${user?.firstName} ${user?.lastName} account. All related data will be lost, and that action can not be undone. Are you sure to proceed?`}
        />
    </>
}

function AccountImage({account}: { account: Account }) {
    const image = useMemo(() => {
        const image = find(MetadataEnum.ACCOUNT_IMAGE, account);
        if (!image) {
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
    setImpersonate: (account: Account) => void,
    organizations?: Record<string, Organization>,
    editUser?: ((userId: string) => void)
): IColumnType<Account>[] {
    const columns: IColumnType<Account>[] = [
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
                    ? <Circle sx={{backgroundColor: 'error.main'}}/>
                    : <Circle sx={{backgroundColor: 'success.main'}}/>;
            }
        },
    ];

    if (account.accountType === AccountEnum.SYSTEM) {
        columns.push({
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
        })
    }

    if (account.accountType === AccountEnum.SYSTEM) {
        columns.push({
            key: 'organization',
            title: 'Organization',
            render: account => {
                if (!organizations) {
                    return '';
                }
                const orgId = findOrganizationId(account);
                if (!orgId) {
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
            render: (account) => roleToString(find(MetadataEnum.ORGANIZATION_ROLE, account) as OrganizationRoleEnum)
        },
        {
            key: 'actions',
            title: '',
            render: (acc) => {
                return (
                    <>
                        {account.accountType === AccountEnum.SYSTEM && acc.accountType !== AccountEnum.SYSTEM && <IconButton
                            aria-label={'Impersonate'}
                            onClick={() => {
                                setImpersonate(acc);
                            }}
                        >
                            <LoginIcon/>
                        </IconButton>}
                        <IconButton
                            aria-label='edit'
                            onClick={() => {
                                editUser ? editUser(acc.id) : navigate("/users/" + acc.id)
                            }}
                        >
                            <ModeOutlinedIcon/>
                        </IconButton>
                        <IconButton
                            aria-label='delete'
                            onClick={() => onDelete(acc)}
                        >
                            <DeleteOutlinedIcon/>
                        </IconButton>
                    </>
                );
            }
        });

    return columns;
}