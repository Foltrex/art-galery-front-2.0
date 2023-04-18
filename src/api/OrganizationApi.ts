import {Organization} from "../entities/organization";
import {IPage, useFetch, usePost, useUpdate} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

export const useGetAllOrganizations = (params: { page: number, sort:string, name?:string, status?:string, size: number, id?: string }) => {
    return useFetch<IPage<Organization>>(
        `${API}`,
        params,
        {enabled: true, retry: false}
    );
}


export const useGetAllOrganizationList = () => {
    return useFetch<Organization[]>(`${API}/list`);
}

export const useGetOrganizationById = (id?: string) => {
    return useFetch<Organization>(
        `${ART_SERVICE}/organizations/${id}`,
        undefined,
        {enabled: !!id, retry: false}
    );
}

export const useCreateOrganization = () => {
    return usePost<Organization>(`${API}`);
}

export const useUpdateOrganizationById = (organizationId: string) => {
    return useUpdate<Organization>(`${API}/${organizationId}`);
}
