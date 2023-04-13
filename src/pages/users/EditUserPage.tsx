import {AbstractUserPage} from "./components/AbstractUserPage";
import {updateUser, useGetAccountById} from "../../api/AccountApi";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../../components/ui/Loading";
import {Account} from "../../entities/account";
import {getErrorMessage} from "../../util/PrepareDataUtil";
import Bubble from "../../components/bubble/Bubble";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

export const EditUserPage = () => {
    const matches = useParams();
    const {authStore} = useRootStore();
    const {data} = useGetAccountById(matches.id);
    const navigate = useNavigate();
    if(!data) {
        return <Loading />
    }
    return <AbstractUserPage back={() => navigate("/users")} account={data} onSubmit={(account:Account) =>
        updateUser(account)
            .then((response) => {
                if(response.data.id === authStore.account.id) {
                    authStore.setAccount(response.data);
                }
                navigate("/users");
                return true
            })
            .catch((error:any) => {
                Bubble.error({message: "Failed to update account information. Error message is: " + getErrorMessage(error), duration: 999999});
                return false
            })
    }/>
}