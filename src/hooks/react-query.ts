import axios, { AxiosError, AxiosResponse } from "axios";
import { QueryFunctionContext, useInfiniteQuery, useQueryClient, UseQueryOptions, useQuery, useMutation } from "react-query";
import { axiosApi } from "../http/axios";

type QueryType = [string, object | undefined];

// TODO: maybe delete latter
export interface IPageable {
    offset: number;
    pageNumber: number;
    pageSize: number;
}

export interface IPage<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable: IPageable;
}

export const fetch = <T>(query: QueryType): Promise<T> => {
    const [url, params] = query;
    return axiosApi
        .get<T>(url, { params: params })
        .then(response => response.data);
};

// TODO: use for addresses and organizaitons in forms
export const usePrefetch = <T>(
    url: string | null, 
    key: string,
    params?: object
) => {
    const queryClient = useQueryClient();

    return () => {
        if (url) {
            const query: QueryType = [url, params];

            queryClient.prefetchQuery<T, Error, T, string>(
                key,
                (context) => fetch(query)
            );
        }
    };
};


export const useFetch = <T>(
    key: string,
    url: string | null,
    params?: object,
    config?: UseQueryOptions<T, Error, T, string>
) => {
    const query: QueryType = [url!, params];

    return useQuery<T, Error, T, string>(
        key,
        (context) => fetch(query),
    );
};


const useGenericMutation = <T, S>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    key: string,
    url: string,
    params?: object,
    updater?: ((oldData: T, newData: S) => T) | undefined
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse, AxiosError, T | S>(func, {
        onMutate: async (data) => {
            await queryClient.cancelQueries(key);
            const previousData = queryClient.getQueryData(key);

            queryClient.setQueryData<T>(key, (oldData) => {
                return updater ? updater(oldData!, data as S) : (data as T);
            });

            return previousData;
        },
        onError: (err, _, context) => {
            queryClient.setQueryData(key, context);
        },
        onSettled: () => {
            queryClient.invalidateQueries(key);
        },
    });
};



export const useDelete = <T>(
    key: string,
    url: string,
    params?: object,
    updater?: (oldData: T, id: string | number) => T
) => {
    return useGenericMutation<T, string | number>(
        id => axiosApi.delete(`${url}/${id}`),
        key,
        url,
        params,
        updater
    );
};

export const usePost = <T, S>(
    key: string,
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.post<S>(url, data),
        key,
        url,
        params,
        updater
    );
};

export const useUpdate = <T, S>(
    key: string,
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T,
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.put<S>(url, data),
        key,
        url,
        params,
        updater
    );
};