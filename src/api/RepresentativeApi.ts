import {Representative} from "../entities/representative";
import {IPage, useDelete, useFetch, usePost, useUpdate} from "../hooks/react-query";
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

export const useGetRepresentativeByAccountId = (accountId?: string) => {
    return useFetch<Representative>(
        `${ART_SERVICE}/representatives/accounts/${accountId}`,
        undefined,
        { enabled: !!accountId, retry: false }
    );
}

export const useDeleteRepresentative = () => {
    return useDelete(`${ART_SERVICE}/representatives`);
}

export const useSaveRepresentative = () => {
    return usePost<Representative>(`${ART_SERVICE}/representatives`);
}


export const useUpdateRepresentativeById = (representativeId?: string) => {
    return useUpdate<Representative>(`${ART_SERVICE}/representatives/${representativeId}`, undefined, { enabled: !!representativeId })
}