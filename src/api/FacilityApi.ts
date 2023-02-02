import { Facility } from "../entities/facility";
import { IPage, useDelete, useFetch, usePost } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";

const FACILITY_KEY = `${ART_SERVICE}/facilities`;


export const useGetFacilitiesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Facility>>(
        FACILITY_KEY,
        `${ART_SERVICE}/facilities/accounts/${accountId}`,
        {
            page: page,
            size: size
        })
}

export const useGetFacilitiesByAccountId = (accountId: string) => {
    return useFetch<Facility[]>(
        FACILITY_KEY,
        `${ART_SERVICE}/facilities/list/accounts/${accountId}`,
    );
}

export const useAddFacility = (
    updater: (oldData: Facility[], newData: Facility) => Facility[]
) => {
    return usePost<Facility[], Facility>(
        FACILITY_KEY,
        `${ART_SERVICE}/facilities`,
        undefined,
        updater
    );
}


export const useDeleteFacility = (
    updater: (oldData: Facility[], deletedId: string | number) => Facility[]
) => {
    return useDelete<Facility[]>(
        FACILITY_KEY,
        `${ART_SERVICE}/facilities`,
        undefined,
        updater
    );
}

export class FacilityApi {

    static deleteById(id: string) {
        return axiosApi.delete<any>(`${ART_SERVICE}/facilities/${id}`)
    }
    static save(facility: Facility) {
        return axiosApi.post<Facility>(`${ART_SERVICE}/facilities`)
    }

    static getFacilityById(id: string) {
        return axiosApi.get<Facility>(`${ART_SERVICE}/facilities/${id}`)
    }

    static getAllFacilitiesPage(page?: number, size?: number) {
        return axiosApi.get<any>(`${ART_SERVICE}/facilities`, {
            params: {
                page: page,
                size: size,
            }
        })
    }

}