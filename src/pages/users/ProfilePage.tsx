import React from 'react';
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {observer} from "mobx-react-lite";
import {AbstractUserPage} from "./components/AbstractUserPage";
import {Account} from "../../entities/account";
import {updateUser} from "../../api/AccountApi";
import Bubble from "../../components/bubble/Bubble";
import {getErrorMessage} from "../../util/PrepareDataUtil";


const ProfilePage = observer(() => {
    const {authStore} = useRootStore();
    const account = authStore.account;
    return <AbstractUserPage
        account={account}
        onSubmit={(account:Account) => updateUser(account)
            .then((response) => {
                authStore.setAccount(response.data)
                return true
            })
            .catch((error:any) => {
                Bubble.error({message: "Failed to update account information. Error message is: " + getErrorMessage(error), duration: 999999});
                return false;
            })
    }/>;
});

export default ProfilePage;
