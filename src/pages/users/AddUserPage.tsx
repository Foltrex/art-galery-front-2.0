import { AbstractUserPage } from "./components/AbstractUserPage";
// import {createUser} from "../../api/AccountApi";
import { useNavigate } from "react-router-dom";
import { Account } from "../../entities/account";
import { getErrorMessage } from "../../util/PrepareDataUtil";
import Bubble from "../../components/bubble/Bubble";
import { AccountEnum } from "../../entities/enums/AccountEnum";
import { useRegisterUser } from "../../api/AuthApi";
import { MetadataEnum } from "../../entities/enums/MetadataEnum";
import { useRootStore } from "../../stores/provider/RootStoreProvider";
import { findFacilityId, findOrganizationId } from "../../util/MetadataUtil";

export const AddUserPage = () => {
    const navigate = useNavigate();
    const { authStore } = useRootStore();
    const account = authStore.account;

    const data: Account = {
        id: '',
        email: '',
        firstName: '',
        blockedSince: new Date(),
        lastName: '',
        accountType: AccountEnum.REPRESENTATIVE,
        metadata: []
    }

    if (account.accountType === AccountEnum.REPRESENTATIVE) {
        data.metadata.push({
            key: MetadataEnum.ORGANIZATION_ID,
            value: findOrganizationId(account)!
        });

        data.metadata.push({
            key: MetadataEnum.FACILITY_ID,
            value: findFacilityId(account)!
        })
    }

    const metationRegisterUser = useRegisterUser();

    return <AbstractUserPage
        account={data}
        back={() => navigate("/users")}
        onSubmit={(account: Account) =>
            metationRegisterUser.mutateAsync(account)
                .then(_ => {
                    navigate("/users");
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