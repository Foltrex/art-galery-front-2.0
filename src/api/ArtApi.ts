import {Art} from "../entities/art"
import {useDelete, useFetch, useLoadMore, usePost} from "../hooks/react-query"
import {AxiosError} from "axios/index";

const ARITSTS_ART_PAGE_SIZE = 18;

export const useGetArtById = (id: string|undefined, showError:(error:AxiosError) => void) => {
    return useFetch<Art>(
        `arts/${id}`,'GET:arts/id',{},
        showError,
        { enabled: !!id }
    );
}

export const useGetAllArts = (params: { sort:string, searchText?: string, artistName?: string, artistId?: string, cityId?: string}, showError:(error:AxiosError) => void) => {
    return useLoadMore<Art>(`arts/`, 'GET:arts', {
        ...params, size: ARITSTS_ART_PAGE_SIZE
    }, showError);
}

export const useSaveArt = (showError:(error:AxiosError) => void) => {
    return usePost<Art>('arts', {}, ['GET:arts', 'GET:arts/id'], showError);
}

export const useDeleteArt = (showError:(error:AxiosError) => void) => {
    return useDelete('arts', {}, ['GET:arts', 'GET:arts/id'], showError);
}
