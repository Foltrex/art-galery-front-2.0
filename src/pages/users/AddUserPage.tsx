import {AbstractUserPage} from "./components/AbstractUserPage";
// import {createUser} from "../../api/AccountApi";
import {useNavigate} from "react-router-dom";
import {Account} from "../../entities/account";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {useRegisterUser} from "../../api/AuthApi";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {findFacilityId, findOrganizationId} from "../../util/MetadataUtil";
import {getErrorMessage} from "../../components/error/ResponseError";

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

    let organizationId = undefined;
    if (account.accountType === AccountEnum.REPRESENTATIVE) {
        organizationId = findOrganizationId(account)!

        data.metadata.push({
            key: MetadataEnum.ORGANIZATION_ID,
            value: organizationId
        });

        data.metadata.push({
            key: MetadataEnum.FACILITY_ID,
            value: findFacilityId(account)!
        })
    }

    const mutationRegisterUser = useRegisterUser((error) =>
        getErrorMessage("Failed to create new account", error));

    return <AbstractUserPage
        account={data}
        organizationId={organizationId}
        back={() => navigate("/users")}
        onSubmit={(account: Account) =>
            mutationRegisterUser.mutateAsync(account)
                .then(_ => {
                    navigate("/users");
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