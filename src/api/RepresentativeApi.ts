import {Representative} from "../entities/representative";
import {IPage, useDelete, useFetch, usePost} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";

export const useGetRepresentativesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Representative>>(
        `${ART_SERVICE}/representatives/account/${accountId}`,
        {
            page: page,
            size: size
        }
    )
}

export const useDeleteRepresentative = () => {
    return useDelete(`${ART_SERVICE}/representatives`);
}

export const useSaveRepresentative = () => {
    return usePost<Representative>(`${ART_SERVICE}/representatives`);
}
