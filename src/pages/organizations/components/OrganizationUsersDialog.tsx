import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {observer} from "mobx-react";
import UserTable from "../../users/components/UserTable";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {updateUser, useGetAccountById} from "../../../api/AccountApi";
import Loading from "../../../components/ui/Loading";
import {AbstractUserPage} from "../../users/components/AbstractUserPage";
import {Account} from "../../../entities/account";
import Bubble from "../../../components/bubble/Bubble";
import {getErrorMessage} from "../../../util/PrepareDataUtil";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {useRegisterUser} from "../../../api/AuthApi";

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
    const {data} = useGetAccountById(userId);
    if(!data) {
        return <Loading />
    }
    return <AbstractUserPage
        back={() => goBack()}
        account={data}
        organizationId={organizationId}
        onSubmit={(account:Account) =>
        updateUser(account)
            .then((response) => {
                if(response.data.id === authStore.account.id) {
                    authStore.setAccount(response.data);
                }
                goBack();
                return true
            })
            .catch((error:any) => {
                Bubble.error({message: "Failed to update account information. Error message is: " + getErrorMessage(error), duration: 999999});
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
    const metationRegisterUser = useRegisterUser();

    return <AbstractUserPage
        account={data}
        organizationId={organizationId}
        back={() => goBack()}
        onSubmit={(account: Account) =>
            metationRegisterUser.mutateAsync(account)
                .then(_ => {
                    goBack()
                    return true
                })
                .catch((error: any) => {
                    Bubble.error({ message: "Failed to create new account. Error message is: " + getErrorMessage(error), duration: 999999 });
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
        <Dialog open={open} onClose={onClose} maxWidth={"lg"} fullWidth>
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
