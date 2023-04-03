import {USER_SERVICE} from "../http/axios";
import {IPage, useDelete, useFetch, usePatch, usePost} from "../hooks/react-query";
import {AuthService} from "../services/AuthService";
import {Account} from "../entities/account";
import {Representative} from "../entities/representative";


export const useGetAll = (filter: { email?: string, page?: number, size?: number }) => {
    return useFetch<IPage<Account>>(`${USER_SERVICE}/accounts`, filter, {
        retry: false
    });
}

export const useGetAccountById = (id?: string) => {
    return useFetch<Account>(`${USER_SERVICE}/accounts/${id}`, undefined, {
        enabled: !!id
    })
}

export const useUpdateAccountImageById = (id: string) => {
    return usePatch(`${USER_SERVICE}/accounts/${id}/account-image`, undefined, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`,
            }
        },
    );
}

export const useUpdateAccountPasswordById = (id: string) => {
    return usePatch(`${USER_SERVICE}/accounts/${id}/password`, undefined, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}

export const useDeleteAccountById = () => {
    return useDelete(`${USER_SERVICE}/accounts`, undefined, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}

export const useSaveRepresentative = () => {
    return usePost<object, Representative>(`${USER_SERVICE}/auth/register-representative`, undefined, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}
