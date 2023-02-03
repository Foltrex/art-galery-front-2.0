import { Facility } from "../entities/facility";
import { IPage, useDelete, useFetch, usePost } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";


export const useGetFacilitiesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Facility>>(`${ART_SERVICE}/facilities/accounts/${accountId}`, {
        page: page,
        size: size
    })
}

export const useGetFacilitiesByAccountId = (accountId: string) => {
    return useFetch<Facility[]>(`${ART_SERVICE}/facilities/list/accounts/${accountId}`);
}

export const useSaveFacility = () => {
    return usePost<Facility>(`${ART_SERVICE}/facilities`);
}


export const useDeleteFacility = () => {
    return useDelete(`${ART_SERVICE}/facilities`);
}