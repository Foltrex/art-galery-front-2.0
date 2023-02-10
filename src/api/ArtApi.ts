import { Art } from "../entities/art"
import { useFetch, useLoadMore, usePost } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios";

const ART_PAGE_SIZE = 9;

export const useGetArtById = (id?: string) => {
    return useFetch<Art>(
        `${ART_SERVICE}/arts/${id}`,
        undefined,
        { enabled: !!id }
    );
}

export const useGetAllArtsByAccountId = (accountId: string, page: number = 0) => {
    return useLoadMore<Art>(`${ART_SERVICE}/arts/accounts/${accountId}`, {
        page: page,
        size: ART_PAGE_SIZE
    });
}

export const useSaveArt = () => {
    return usePost<Art>(`${ART_SERVICE}/arts`);
}