import { Art } from "../entities/art"
import { useFetch, useLoadMore } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios";

export const useGetArtById = (id: string) => {
    return useFetch<Art>(`${ART_SERVICE}/arts/${id}`);
}

export const useGetAllArtsByAccountId = (accountId: string) => {
    return useLoadMore<Art[]>(`${ART_SERVICE}/arts/accounts/${accountId}`);
}