import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {observer} from "mobx-react";
import UserTable from "../../users/components/UserTable";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {useGetAccountById, useUpdateUser} from "../../../api/AccountApi";
import Loading from "../../../components/ui/Loading";
import {AbstractUserPage} from "../../users/components/AbstractUserPage";
import {Account} from "../../../entities/account";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {useRegisterUser} from "../../../api/AuthApi";
import {getErrorMessage} from "../../../components/error/ResponseError";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
}

enum Mode {
    LIST, NEW, EDIT
}

const EditUserComponent = ({userId, goBack, organizationId}:{organizationId:string, userId:string, goBack:() => void}) => {
    const {authStore} = useRootStore();
    const {data} = useGetAccountById(userId, (error) => {
        getErrorMessage("Failed to load account details", error);
    });
    const updateUser = useUpdateUser(userId, (error) => {
        getErrorMessage("Failed to create new organization", error);
    });
    if(!data) {
        return <Loading />
    }
    return <AbstractUserPage
        back={() => goBack()}
        account={data}
        organizationId={organizationId}
        onSubmit={(account:Account) =>
        updateUser.mutateAsync(account)
            .then((response) => {
                if(response.data.id === authStore.account.id) {
                    authStore.setAccount(response.data);
                }
                goBack();
                return true
            })
            .catch((error:any) => {
                getErrorMessage("Failed to update account information", error);
                return false
            })
    }/>
}

const AddUserComponent = ({userId, goBack, organizationId}:{organizationId:string, userId:string, goBack:() => void}) => {
    const data: Account = {
        id: '',
        email: '',
        firstName: '',
        blockedSince: new Date(),
        lastName: '',
        accountType: AccountEnum.REPRESENTATIVE,
        metadata: [{
            key: MetadataEnum.ORGANIZATION_ID,
            value: organizationId
        }]
    }
    const mutationRegisterUser = useRegisterUser((error) => {
        getErrorMessage("Failed to create new account", error)
    });

    return <AbstractUserPage
        account={data}
        organizationId={organizationId}
        back={() => goBack()}
        onSubmit={(account: Account) =>
            mutationRegisterUser.mutateAsync(account)
                .then(_ => {
                    goBack()
                    return true
                })
                .catch(() => {
                    return false;
                })
            //     .then()
            // createUser(account)
        }
    />
}

const OrganizationUsersDialog = observer(({open, onClose, organizationId}: IOrganizationFacilitiesDialogProps) => {
    const [mode, setMode] = useState(Mode.LIST);
    const [userId, setUserId] = useState('');

    return (
        <Dialog open={open} onClose={(e, reason) => {
            if(reason !== 'backdropClick')
                onClose();
        }} maxWidth={"lg"} fullWidth>
            <DialogContent>
                {mode === Mode.NEW && <AddUserComponent
                    userId={userId}
                    goBack={() => setMode(Mode.LIST)}
                    organizationId={organizationId} />}
                {mode === Mode.EDIT && <EditUserComponent
                    userId={userId}
                    goBack={() => setMode(Mode.LIST)}
                    organizationId={organizationId}/>}
                {mode === Mode.LIST && <UserTable
                    organizationId={organizationId}
                    editUser={(userId) => {
                        setMode(Mode.EDIT)
                        setUserId(userId)
                    }}
                    newUser={() => setMode(Mode.NEW)}/>}
            </DialogContent>
            {mode === Mode.LIST && <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>}
        </Dialog>
    );
});

export default OrganizationUsersDialog;
