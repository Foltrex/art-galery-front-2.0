import UserTable from './components/UserTable';
import {findOrganizationId} from "../../util/MetadataUtil";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

const UserRoute = () => {
    const {authStore} = useRootStore();
    return <UserTable organizationId={findOrganizationId(authStore.account) || undefined} />
};

export default UserRoute;
