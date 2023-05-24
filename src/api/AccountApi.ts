import {IPage, QueryKeyT, useDelete, useFetch, usePatch, useUpdate} from "../hooks/react-query";
import {Account} from "../entities/account";
import {AxiosError} from "axios";
import {UseQueryOptions} from "react-query";
import {axiosApi} from "../http/axios";
import {TAuthToken} from "../entities/types/TAuthToken";

export const useGetAll = (
    filter: {
        email?: string,
        page?: number,
        size?: number,
        //username?: string,not work currently, should be applied to username, which is actually email
        name?: string,//search in lastname and firstname
        usertype?: string,
        organizationId?: string,
        cityId?: string
        sort?: string
    },
    showError: (error:AxiosError) => void,
    config?: UseQueryOptions<IPage<Account>, Error, IPage<Account>, QueryKeyT>
) => {
    return useFetch<IPage<Account>>(`accounts`, 'GET:accounts', filter, showError, config || {retry: false});
}

export const useGetAccountById = (id: string|undefined, showError: (error:AxiosError) => void) => {
    return useFetch<Account>(`accounts/${id}`, 'GET:accounts/id', {}, showError, {
        enabled: !!id
    });
}

export const useUpdateAccountPasswordById = (id: string, showError: (error:AxiosError) => void) => {
    return usePatch(`accounts/${id}/password`, {}, ['GET:accounts', 'GET:accounts/id'], showError);
}

export const useDeleteAccountById = (showError: (e: AxiosError) => void) => {
    return useDelete(`accounts`, {}, ['GET:accounts', 'GET:accounts/id'], showError);
}

export const useUpdateUser = (accountId:string, showError: (error:AxiosError) => void) => {
    return useUpdate<Account>(`accounts/${accountId}`, {}, ["GET:accounts", 'GET:accounts/id'], showError);
}
export const impersonateAction = (params:{username:string}, showError: (error:AxiosError) => void) => {
    return axiosApi.get<{username:string}, {data: TAuthToken}>(`auth/impersonate?username=${encodeURIComponent(params.username)}`, {}).catch(showError);
}