import axios, { AxiosError, AxiosResponse } from "axios";
import { QueryFunctionContext, useInfiniteQuery, useQueryClient, UseQueryOptions, useQuery, useMutation } from "react-query";

type QueryKeyT = [string, object | undefined];

// TODO: maybe delete latter
interface IPage<T> {
    next?: number;
    previous: number;
    data: T;
    count: number;
}

export const fetch = <T>({
    queryKey,
    pageParam = 1,
}: QueryFunctionContext<QueryKeyT>): Promise<T> => {
    const [url, params] = queryKey;
    return axios
        .get<T>(url, { params: { ...params, pageParam } })
        .then(response => response.data);
};

export const useLoadMore = <T>(url: string | null, params?: object) => {
    return useInfiniteQuery<IPage<T>, Error, IPage<T>, QueryKeyT>(
        [url!, params],
        context => fetch(context),
        {
            getPreviousPageParam: (firstPage) => firstPage.previous ?? false,
            getNextPageParam: (lastPage) => lastPage.next ?? false,
        }
    );
}

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
    config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
    const context = useQuery<T, Error, T, QueryKeyT>(
        [url!, params],
        context => fetch(context),
        {
            enabled: !!url,
            ...config,
        }
    );

    return context;
};


const useGenericMutation = <T, S>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    url: string,
    params?: object,
    updater?: ((oldData: T, newData: S) => T) | undefined
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse, AxiosError, T | S>(func, {
        onMutate: async (data) => {
            await queryClient.cancelQueries([url!, params]);

            const previousData = queryClient.getQueryData([url!, params]);

            queryClient.setQueryData<T>([url!, params], (oldData) => {
                return updater ? updater(oldData!, data as S) : (data as T);
            });

            return previousData;
        },
        onError: (err, _, context) => {
            queryClient.setQueryData([url!, params], context);
        },
        onSettled: () => {
            queryClient.invalidateQueries([url!, params]);
        },
    });
};



export const useDelete = <T>(
    url: string,
    params?: object,
    updater?: (oldData: T, id: string | number) => T
) => {
    return useGenericMutation<T, string | number>(
        id => axios.delete(`${url}/${id}`),
        url,
        params,
        updater
    );
};

export const usePost = <T, S>(
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T
) => {
    return useGenericMutation<T, S>(
        data => axios.post<S>(url, data),
        url,
        params,
        updater
    );
};

export const useUpdate = <T, S>(
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T
) => {
    return useGenericMutation<T, S>(
        data => axios.put<S>(url, data),
        url,
        params,
        updater
    );
};