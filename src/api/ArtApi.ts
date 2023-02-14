import { Art } from "../entities/art"
import { useDelete, useFetch, useLoadMore, usePost } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios";

const ART_PAGE_SIZE = 9;

export const useGetArtById = (id?: string) => {
    return useFetch<Art>(
        `${ART_SERVICE}/arts/${id}`,
        undefined,
        { enabled: !!id }
    );
}

export const useGetAllArtsByAccountIdAndSearchText = (accountId: string, params?: object) => {
    return useLoadMore<Art>(`${ART_SERVICE}/arts/accounts/${accountId}`, {
        size: ART_PAGE_SIZE,
        ...params
    });
}

export const useSaveArt = () => {
    return usePost<Art>(`${ART_SERVICE}/arts`);
}

export const useDeleteArt = () => {
    return useDelete(`${ART_SERVICE}/arts`);
}