import axios from "axios";
import { number } from "yup";
import { Facility } from "../entities/facility";
import { IPage, useFetch, usePost, useUpdate } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";


export const useGetFacilitiesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Facility>>(`${ART_SERVICE}/facilities/account/${accountId}`, {
        page: page,
        size: size
    })
}

export const useGetFacilityByAccountId = (accountId: string) => {
    return useFetch<Facility>(`${ART_SERVICE}/facilities/one/account/${accountId}`);
}

export const useAddFacility = (
    updater: (oldData: Facility[], newData: Facility) => Facility[]
) => {
    return usePost<Facility[], Facility>(
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