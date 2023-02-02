import { OrganizationRole } from "../entities/organizationRole"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"

const ORGANIZATION_ROLE_KEY = `${ART_SERVICE}/organization-roles`;

export const useGetOrganizationRoles = () => {
    return useFetch<OrganizationRole[]>(ORGANIZATION_ROLE_KEY, `${ART_SERVICE}/organization-roles`);
}