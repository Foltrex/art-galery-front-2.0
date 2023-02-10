import { AxiosError, AxiosResponse } from "axios";
import { QueryFunctionContext, useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { axiosApi } from "../http/axios";

type QueryKeyT = [string, object | undefined];

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


export const fetch = <T>({
    queryKey,
    pageParam,
}: QueryFunctionContext<QueryKeyT>): Promise<T> => {
    const [url, params] = queryKey;
    return axiosApi
        .get<T>(url, { params: { ...params, pageParam } })
        .then(response => response.data);
};

// TODO: use for addresses and organizaitons in forms
export const usePrefetch = <T>(url: string | null, params?: object) => {
    const queryClient = useQueryClient();

    return () => {
        if (url) {
            queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
                [url!, params],
                context => fetch(context)
            );
        }
    };
};


export const useFetch = <T>(
    url: string | null,
    params?: object,
    enabled: boolean = true,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
    const context = useQuery<T, Error, T, QueryKeyT>(
        [url!, params],
        context => fetch(context),
        {
            enabled: !!url && enabled,
            ...config,
        }
    );

    return context;
};

export const useLoadMore = <T>(url: string | null, params?: object) => {
    const context = useInfiniteQuery<
        IPage<T>,
        Error,
        IPage<T>,
        QueryKeyT
    >(
        [url!, params],
        context => fetch({ ...context, pageParam: context.pageParam ?? 1 }),
        {
            getNextPageParam: (lastPage) => !lastPage.last,
        }
    );

    return context;
};

const useGenericMutation = <T, S = T | undefined>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    url: string,
    params?: object,
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse<S>, AxiosError, T | S>(func, {
        onMutate: async () => await queryClient.cancelQueries([url!, params]),
        onError: (err, _, context) => {
            queryClient.setQueryData([url!, params], context);
        },
        onSettled: () => queryClient.invalidateQueries()
    });
};


export const useDelete = (
    url: string,
    params?: object,
    config?: object
) => {
    return useGenericMutation<string | number>(
        id => axiosApi.delete(`${url}/${id}`, config),
        url,
        params
    );
};

export const usePost = <T, S = T>(
    url: string,
    params?: object,
    config?: object
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.post<S>(url, data, config),
        url,
        params
    );
};

export const useUpdate = <T, S = T>(
    url: string,
    params?: object,
    config?: object
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.put<S>(url, data, config),
        url,
        params
    );
};
