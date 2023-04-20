import {Art} from "../entities/art"
import {useDelete, useFetch, useLoadMore, usePost} from "../hooks/react-query"
import {ART_SERVICE} from "../http/axios";

const ART_PAGE_SIZE = 9;
const ARITSTS_ART_PAGE_SIZE = 9;

export const useGetArtById = (id?: string) => {
    return useFetch<Art>(
        `${ART_SERVICE}/arts/${id}`,
        undefined,
        { enabled: !!id }
    );
}

export const useGetAllArts = (params?: { searchText?: string, artistName?: string, artistId?: string, cityId?: string}) => {
    return useLoadMore<Art>(`${ART_SERVICE}/arts/`, {
        size: ART_PAGE_SIZE,
        ...params
    });
}

export const useGetAllArtsByArtistId = (artistId?: string, params?: object) => {
    return useLoadMore<Art>(
        `${ART_SERVICE}/arts/artists/${artistId}`, 
        {
            size: ARITSTS_ART_PAGE_SIZE, 
            ...params,
        },
        { enabled: !!artistId }
    )
}

export const useSaveArt = () => {
    return usePost<Art>(`${ART_SERVICE}/arts`);
}

export const useDeleteArt = () => {
    return useDelete(`${ART_SERVICE}/arts`);
}
