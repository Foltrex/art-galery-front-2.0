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

export type QueryKeyT = [string, string, object | undefined];

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

export const createEmptyPage = <T>() => {
    const emptyPage: IPage<T> = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        size: 0,
        number: 0,
        first: false,
        last: false,
        empty: false,
        pageable: {
            offset: 0,
            pageNumber: 0,
            pageSize: 25,
        }
    };

    return emptyPage;
}


export const useFetch = <T>(
    url: string,
    key:string,
    params: object|undefined,
    showError:(error:AxiosError) => void,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
    return useQuery<T, Error, T, QueryKeyT>(
        [key, url, params],
        context => fetch<T>(context, showError),
        {
            enabled: !!url,
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            cacheTime: 9999999,
            ...config,
        }
    );
};

export const useLoadMore = <T>(
    url: string,
    key:string,
    params: object,
    showError:(error:AxiosError) => void
) => {
    return useInfiniteQuery<
        IPage<T>,
        Error,
        IPage<T>,
        QueryKeyT
    >(
        [key, url, params],
        context => fetch({ ...context, pageParam: context.pageParam ?? 0 }, showError),
        {
            retry: false,
            getNextPageParam: (page) => !page.last
                ? page.number + 1
                : page.number
        },
    );
};



export const useDelete = (
    url: string,
    params: object,
    invalidate: string[],
    showError: (error:AxiosError) => void,
    config?: object,
) => {
    return useGenericMutation<string | number>(
        id => axiosApi.delete(`${url}/${id}`, config),
        "DELETE:",
        url,
        invalidate,
        params,
        showError
    );
};

export const usePost = <T, S = T>(
    url: string,
    params: object,
    invalidate: string[],
    showError: (error:AxiosError) => void,
    config?: object
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.post<S>(url, data, config),
        "POST:",
        url,
        invalidate,
        params,
        showError
    );
};

export const useUpdate = <T, S = T>(
    url: string,
    params: object,
    invalidate: string[],
    showError: (error:AxiosError) => void,
    config?: object
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.put<S>(url, data, config),
        "PUT:",
        url,
        invalidate,
        params,
        showError
    );
};

export const usePatch = <T, S = T>(
    url: string,
    params: object,
    invalidate:string[],
    showError:(error:AxiosError) => void,
    config?: object,
) => {
    return useGenericMutation<T, S>(
        data => axiosApi.patch<S>(url, data, config),
        "PATCH:",
        url,
        invalidate,
        params,
        showError
    );
};


const useGenericMutation = <T, S = T | undefined>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    urlPrefix:string,
    url: string,
    invalidate: string[],
    params: object,
    showError: (error: AxiosError) => void
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse<S>, AxiosError, T | S>(
        func,
        {
            onMutate: () => queryClient.cancelQueries([urlPrefix + url, params]),
            onError: (err, _, context) => {
                showError(err);
                return new Promise(r => r(err));
            },
            onSuccess: () => invalidate.forEach(i => queryClient.invalidateQueries(i))
        }
    );
};

const fetch = <T>({
                       queryKey,
                       pageParam,
                   }: QueryFunctionContext<QueryKeyT>, showError: (error:AxiosError) => void): Promise<T> => {
    const [key, url, params] = queryKey;
    return axiosApi
        .get<T>(url, { params: {
                ...params,
                //@ts-ignore
                page: params?.page || pageParam
            } })
        .then(response => response.data)
        .catch(e => {
            showError(e);
            return e;
        })
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
    );
}