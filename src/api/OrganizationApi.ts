import {Organization} from "../entities/organization";
import {IPage, useFetch, usePost, useUpdate} from "../hooks/react-query";
import {AxiosError} from "axios";


export const useGetAllOrganizations = (params: { page: number, sort:string, name?:string, status?:string, size: number, id?: string }, showError:(error:AxiosError) => void) => {
    return useFetch<IPage<Organization>>('organizations', 'GET:organizations', params,
        showError, {enabled: true, retry: false});
}

export const useGetAllOrganizationList = (showError:(error:AxiosError) => void) => {
    return useFetch<Organization[]>('organizations/list', 'GET:organizations/list', {}, showError);
}

export const useGetOrganizationById = (id: string|undefined, showError:(error:AxiosError) => void) => {
    return useFetch<Organization>(
        `organizations/${id}`,
        'GET:organizations/id',
        {},
        showError,
        {enabled: !!id, retry: false}
    );
}

export const useCreateOrganization = (showError:(error:AxiosError) => void) => {
    return usePost<Organization>('organizations', {}, ['GET:organizations', 'GET:organizations/id', 'GET:organizations/list'], showError);
}
export const useUpdateOrganizationById = (organizationId: string, showError:(error:AxiosError) => void) => {
    return useUpdate<Organization>(`organizations/${organizationId}`, {}, ['GET:organizations', 'GET:organizations/id', 'GET:organizations/list'], showError);
}
