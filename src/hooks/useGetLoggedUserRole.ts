import { useGetAccountById } from "../api/AccountApi";
import { TokenService } from "../services/TokenService";
import { useRootStore } from "../stores/provider/RootStoreProvider";
import * as MetadataUtils from "../util/MetadataUtil";

export const useGetLoggedUserRole = () => {
	const { authStore } = useRootStore();
	const { account } = authStore; 
    return MetadataUtils.find('organization_role', account);
}