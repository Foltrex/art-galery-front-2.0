import React from 'react';
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {observer} from "mobx-react-lite";
import {AbstractUserPage} from "./components/AbstractUserPage";
import {Account} from "../../entities/account";
import {useUpdateUser} from "../../api/AccountApi";
import {getErrorMessage} from "../../components/error/ResponseError";


const ProfilePage = observer(() => {
    const {authStore} = useRootStore();
    const account = authStore.account;
    const updateUser = useUpdateUser(
        account.id,
        (error) => getErrorMessage("Failed to update account information", error))
    return <AbstractUserPage
        account={account}
        onSubmit={(account:Account) => updateUser.mutateAsync(account)
            .then((response) => {
                authStore.setAccount(response.data)
                return true
            })
            .catch(() => {
                return false;
            })
    }/>;
});

export default ProfilePage;
