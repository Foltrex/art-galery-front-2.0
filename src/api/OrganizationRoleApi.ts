import {OrganizationRole} from "../entities/organizationRole"
import {useFetch} from "../hooks/react-query"
import {ART_SERVICE} from "../http/axios"

export const useGetOrganizationRoles = () => {
    return useFetch<OrganizationRole[]>(`${ART_SERVICE}/organization-roles`);
}
