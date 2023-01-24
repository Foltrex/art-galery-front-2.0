import axios from "axios";
import { Facility } from "../entities/facility";
import { ART_SERVICE, axiosApi } from "../http/axios";

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

    static getAllFacilities() {
        return axiosApi.get<Array<Facility>>(`${ART_SERVICE}/facilities/list`)
    }

}