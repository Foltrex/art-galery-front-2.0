import { QueryKey, UseQueryOptions, useQuery } from "react-query";
import {Organization} from "../entities/organization";
import {IPage, QueryKeyT, useFetch, usePost, useUpdate} from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

const fetchOrganizationsByIds = (ids: string[]) => {
    const requests = ids.map(id => {
        const url = `${API}/${id}`
        return axiosApi.get<Organization>(url);
    })

    return Promise.all(requests)
        .then(responses => responses.map(response => response.data));
}

export const useGetAllOrganizations = (params: { page: number, sort:string, name?:string, status?:string, size: number, id?: string }) => {
    return useFetch<IPage<Organization>>(
        `${API}`,
        params,
        {enabled: true, retry: false}
    );
}

export const useGetOrganizationsByIds = (
    ids: string[], 
    config?: UseQueryOptions<Organization[], unknown, Organization[], QueryKey>
) => {
    return useQuery<Organization[]>(
        [API, {ids: ids}],
        () => fetchOrganizationsByIds(ids),
        { ...config }
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
