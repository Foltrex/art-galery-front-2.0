import {Representative} from "../entities/representative";
import {useDelete, useFetch, useUpdate} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";

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

export const useUpdateRepresentativeById = (representativeId?: string) => {
    return useUpdate<Representative>(`${ART_SERVICE}/representatives/${representativeId}`, undefined, { enabled: !!representativeId })
}