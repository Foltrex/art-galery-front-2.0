import {IPage, useDelete, useFetch, usePost, useUpdate} from "../hooks/react-query"
import {AxiosError} from "axios";
import {Support, SupportThread} from "../entities/SupportThread";

export const useGetAllThreads = (params: {
    page: number,
    size: number,
    sort: string,
    status: string|undefined,
}, showError:(error:AxiosError) => void) => {
    return useFetch<IPage<SupportThread>>(
        `support/thread`,'GET:support/thread', params, showError, {keepPreviousData: true, refetchInterval: 10_000}
    );
}

export const useGetThreadById = (id: string, showError:(error:AxiosError) => void) => {
    return useFetch<SupportThread>(
        `support/thread/${id}`,'GET:support/thread/id', {}, showError, {keepPreviousData : true, refetchInterval: 10_000}
    );
}
export const useCreatePost = (showError:(error:AxiosError) => void) => {
    return usePost<Support>(
        `support`,{}, ['GET:support/thread/id'], showError
    );
}

export const useCreateThread = (showError:(error:AxiosError) => void) => {
    return usePost<SupportThread>(
        `support/thread`,{}, ['GET:support/thread'], showError
    );
}

export const useUpdateThread = (id:string, showError:(error:AxiosError) => void) => {
    return useUpdate<SupportThread>(
        `support/thread/${id}`,{}, ['GET:support/thread', 'GET:support/thread/id'], showError
    );
}

export const useDeleteThread = (id:string|undefined, showError:(error:AxiosError) => void) => {
    return useDelete(
        `support/thread/${id}`,{}, ['GET:support/thread'], showError
    );
}

