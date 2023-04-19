import { ART_SERVICE, axiosApi, USER_SERVICE } from "../http/axios";
import { IPage, useDelete, useFetch, usePatch } from "../hooks/react-query";
import { AuthService } from "../services/AuthService";
import { Account } from "../entities/account";
import { useRootStore } from "../stores/provider/RootStoreProvider";
import { AxiosError } from "axios";


export const useGetAll = (
    filter: {
        email?: string,
        page?: number,
        size?: number,
        username?: string,
        usertype?: string,
        organizationId?: string,
        cityId?: string
        sort?: string
    }) => {
    return useFetch<IPage<Account>>(`${USER_SERVICE}/accounts`, filter, {
        retry: false
    });
}

export const useGetAccountById = (id?: string) => {
    const { authStore } = useRootStore();
    const account = authStore.account;

    return useFetch<Account>(`${USER_SERVICE}/accounts/${id}`, undefined, {
        enabled: !!id && account?.id !== id
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

export const useDeleteAccountById = (errorMessageMapper?: (e: AxiosError) => string) => {
    return useDelete(
        `${USER_SERVICE}/accounts`,
        undefined,
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`,
            }
        },
        errorMessageMapper
    );
}

export const updateUser = (account: Account) => {
    return axiosApi.put<Account>(`${USER_SERVICE}/accounts/${account.id}`, account, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}

// export const createUser = (account:Account) => {
//     return axiosApi.post<Account>(`${ART_SERVICE}/accounts/`, account, {
//         // headers: {
//         //     'Authorization': `Bearer ${AuthService.getToken()}`,
//         // }
//     });
// }
