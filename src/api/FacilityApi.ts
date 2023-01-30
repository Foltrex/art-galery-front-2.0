import axios from "axios";
import { Facility } from "../entities/facility";
import { IPage, useFetch, useLoadMore, usePost, useUpdate } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";

export const useGetFacilitiesList = () => {
    return useFetch<Facility[]>(`${ART_SERVICE}/facilities/list`)
}

export const useGetFacilitiesPage = (page?: number, size?: number) => {
    return useLoadMore<IPage<Facility>>(`${ART_SERVICE}/facilities`, {
        page: page,
        size: size
    });
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