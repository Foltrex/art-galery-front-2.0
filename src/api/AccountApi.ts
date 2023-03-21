import {USER_SERVICE} from "../http/axios";
import {useDelete, useFetch, usePatch, usePost} from "../hooks/react-query";
import {AuthService} from "../services/AuthService";
import { Account } from "../entities/account";
import { Representative } from "../entities/representative";

export const useFetchAccountByEmail = (email: string) => {
    return useFetch(`${USER_SERVICE}/accounts/byEmail/${email}`, undefined, {
        retry: false,
        enabled: !!email,
    });
}

export const useGetAccountById = (id?: string) => {
    return useFetch<Account>(`${USER_SERVICE}/accounts/${id}`, undefined, { enabled: !!id })
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
    return usePost<object, Representative>(`${USER_SERVICE}/auth/register-representative`);
}
