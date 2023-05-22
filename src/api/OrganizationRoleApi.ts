import {OrganizationRole} from "../entities/organizationRole"
import {useFetch} from "../hooks/react-query"
import {AxiosError} from "axios";

export const useGetOrganizationRoles = (showError:(error:AxiosError) => void) => {
    return useFetch<OrganizationRole[]>('organization-roles', 'GET:organization-roles', {}, showError);
}
