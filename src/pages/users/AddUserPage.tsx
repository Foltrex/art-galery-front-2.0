import {AbstractUserPage} from "./components/AbstractUserPage";
import {createUser} from "../../api/AccountApi";
import {useNavigate} from "react-router-dom";
import {Account} from "../../entities/account";
import {getErrorMessage} from "../../util/PrepareDataUtil";
import Bubble from "../../components/bubble/Bubble";
import {AccountEnum} from "../../entities/enums/AccountEnum";

export const AddUserPage = () => {
    const navigate = useNavigate();
    const data:Account = {
        id: '',
        email: '',
        firstName: '',
        blockedSince: new Date(),
        lastName: '',
        accountType: AccountEnum.REPRESENTATIVE,
        metadata: []
    }
    return <AbstractUserPage account={data} back={() => navigate("/users")} onSubmit={(account:Account) =>
        createUser(account)
            .then((response) => {
                navigate("/users");
                return true
            })
            .catch((error:any) => {
                Bubble.error({message: "Failed to update account information. Error message is: " + getErrorMessage(error), duration: 999999});
                return false;
            })
    }/>
}