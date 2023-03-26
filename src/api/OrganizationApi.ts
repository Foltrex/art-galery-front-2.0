import {Organization} from "../entities/organization";
import {IPage, useFetch, useUpdate} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

export const useGetOrganizationByAccountId = (accountId: string) => {
    return useFetch<Organization>(`${API}/accounts/${accountId}`);
}

export const useGetAllOrganizations = (params:{page:number, size:number}) => {
    return useFetch<IPage<Organization>>(
        `${API}`,
        params,
        { enabled: true, retry: false }
    );
}

export const useUpdateOrganizationById = (organizationId: string) => {
    return useUpdate<Organization>(`${API}/${organizationId}`);
}
