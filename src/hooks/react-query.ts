import {AxiosError, AxiosResponse} from "axios";
import {
    QueryFunctionContext,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions
} from "react-query";
import {axiosApi} from "../http/axios";

type QueryKeyT = [string, object | undefined];

const X_TOTAL_COUNT_HEADER: string = "x-total-count";

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

interface QFC<T> extends QueryFunctionContext<QueryKeyT> {
    map?: (p:any) => T
}
export const fetch = <T>({
    queryKey,
    pageParam,
    map,
}: QFC<T>): Promise<T> => {
    const [url, params] = queryKey;
    return axiosApi
        .get<any>(url, { params: { ...params, page: pageParam } })
        .then(response => map ? map(response.data) : ((response.data as any) as T));
};

export const count = (url: string): Promise<number> => {
    return axiosApi
        .head(url)
        .then(response => response.headers)
        .then(headers => headers[X_TOTAL_COUNT_HEADER] ?? '0')
        .then(value => +value);
}

export const useCount = (url: string | null) => {
    return useQuery<number, Error, number, string>(
        url!,
        () => count(url!),
        { retry: 2 }
    );
}

// TODO: use for addresses and organizaitons in forms
export const usePrefetch = <T>(url: string | null, params?: object) => {
    const queryClient = useQueryClient();

    return () => {
        if (url) {
            queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
                [url!, params],
                context => fetch(context),
                { retry: 3 }
            );
        }
    };
};

export const useFetch = <T>(
    url: string | null,
    params?: object,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>,
    map?: (p:any) => T
) => {
    console.log(url, params);
    return useQuery<T, Error, T, QueryKeyT>(
        [url!, params],
        context => fetch<T>({...context, map: map}),
        {
            enabled: !!url,
            retry: 3,
            ...config,
        }
    );
};

export const useLoadMore = <T>(
    url: string | null,
    params?: object,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
    return useInfiniteQuery<
        IPage<T>,
        Error,
        IPage<T>,
        QueryKeyT
    >(
        [url!, params],
        context => fetch({ ...context, pageParam: context.pageParam ?? 0 }),
        {
            retry: 3,
            getNextPageParam: (page) => !page.last
                ? page.number + 1
                : page.number
        }
    );
};

export const useGenericMutation = <T, S = T | undefined>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    url: string,
    params?: object,
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse<S>, AxiosError, T | S>(
        func,
        {
            onMutate: async () => await queryClient.cancelQueries([url!, params]),
            onError: (err, _, context) => {
                console.log(err);
                queryClient.setQueryData([url!, params], context);
            },
            onSettled: () => queryClient.invalidateQueries()
        }
    );
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

export const usePatch = <T, S = T>(
    url: string,
    params?: object,
    config?: object
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.patch<S>(url, data, config),
        url,
        params
    );
};
