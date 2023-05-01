import {Art} from "../entities/art"
import {useDelete, useFetch, useLoadMore, usePost} from "../hooks/react-query"
import {ART_SERVICE} from "../http/axios";

const ARITSTS_ART_PAGE_SIZE = 9;

export const useGetArtById = (id?: string) => {
    return useFetch<Art>(
        `${ART_SERVICE}/arts/${id}`,
        undefined,
        { enabled: !!id }
    );
}

export const useGetAllArts = (params?: { sort:string, searchText?: string, artistName?: string, artistId?: string, cityId?: string}) => {
    return useLoadMore<Art>(`${ART_SERVICE}/arts/`, {
        ...params, size: ARITSTS_ART_PAGE_SIZE
    });
}

export const useSaveArt = () => {
    return usePost<Art>(`${ART_SERVICE}/arts`);
}

export const useDeleteArt = () => {
    return useDelete(`${ART_SERVICE}/arts`);
}
