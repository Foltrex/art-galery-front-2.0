import {Organization} from "../entities/organization";
import { useFetch, useUpdate } from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

export const useGetOrganizationByAccountId = (accountId: string) => {
    return useFetch<Organization>(`${API}/accounts/${accountId}`);
}

export const useGetAllOrganizations = () => {
    return useFetch<Organization[]>(`${API}`)
}

export const useUpdateOrganizationById = (organizationId: string) => {
    return useUpdate<Organization>(`${API}/${organizationId}`);
}
