import {axiosApi, USER_SERVICE} from "../http/axios";
import {IPage, QueryKeyT, useDelete, useFetch, usePatch} from "../hooks/react-query";
import {AuthService} from "../services/AuthService";
import {Account} from "../entities/account";
import {useRootStore} from "../stores/provider/RootStoreProvider";
import {UseQueryOptions} from "react-query";


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
    config?: UseQueryOptions<IPage<Account>, Error, IPage<Account>, QueryKeyT>
) => {
    return useFetch<IPage<Account>>(`${USER_SERVICE}/accounts`, filter, config || {
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

export const useDeleteAccountById = () => {
    return useDelete(`${USER_SERVICE}/accounts`, undefined, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}

export const updateUser = (account:Account) => {
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
