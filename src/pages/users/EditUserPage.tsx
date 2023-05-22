import {AbstractUserPage} from "./components/AbstractUserPage";
import {useGetAccountById, useUpdateUser} from "../../api/AccountApi";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../../components/ui/Loading";
import {Account} from "../../entities/account";

import Bubble from "../../components/bubble/Bubble";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {find} from "../../util/MetadataUtil";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {getErrorMessage} from "../../components/error/ResponseError";

export const EditUserPage = () => {
    const matches = useParams();
    const {authStore} = useRootStore();
    const {data} = useGetAccountById(matches.id, (error) => {
        Bubble.error({
            message: getErrorMessage("Failed to load user details", error),
            duration: 999999
        })
    });
    const updateUser = useUpdateUser(
        matches.id!,
        (error) => Bubble.error({
            message: getErrorMessage("Failed to update account information", error),
            duration: 999999
        }));

    const navigate = useNavigate();
    const organizationId = authStore.account.accountType === AccountEnum.REPRESENTATIVE
        ? find(MetadataEnum.ORGANIZATION_ID, authStore.account)
        : undefined;

    if(!data) {
        return <Loading />
    }
    return <AbstractUserPage back={() => navigate("/users")} organizationId={organizationId || undefined} account={data} onSubmit={(account:Account) =>
        updateUser.mutateAsync(account)
            .then((response) => {
                if(response.data.id === authStore.account.id) {
                    authStore.setAccount(response.data);
                }
                navigate("/users");
                return true
            })
            .catch((error:any) => {
                return false
            })
    }/>
}