import {Facility} from "../entities/facility";
import {IPage, useDelete, useFetch, usePost, useUpdate} from "../hooks/react-query";
import {AxiosError} from "axios";


export const useGetAllFacilities = (params: {page: number, size: number, sort:string, cityId?: string, facilityName?: string, isActive?: boolean | null, organizationId?:string}, showError:(errror:AxiosError) => void) => {
    return useFetch<IPage<Facility>>(
        'facilities',
        'GET:facilities',
        {
            page: params.page || 0,
            size: params.size || 25,
            cityId: params.cityId,
            facilityName: params.facilityName,
            isActive: params.isActive,
            organizationId: params.organizationId,
            sort: params.sort
        },
        showError
    );
}

export const useGetFacilityById = (id: string|undefined, showError:(errror:AxiosError) => void) => {
    return useFetch<Facility>(
        'facilities/' + id,
        'GET:facilities/id',
        undefined,
        showError,
        { enabled: !!id }
    );
}


export const useSaveFacility = (showError:(errror:AxiosError) => void) => {
    return usePost<Facility>('facilities', {}, ['GET:facilities', 'GET:facilities/id'], showError);
}

export const useUpdateFacility = (facilityId:string|undefined, showError:(errror:AxiosError) => void) => {
    return useUpdate<Facility>('facilities/' + facilityId, {}, ['GET:facilities', 'GET:facilities/id'], showError);
}


export const useDeleteFacility = (showError:(errror:AxiosError) => void) => {
    return useDelete('facilities', {}, ['GET:facilities', 'GET:facilities/id'], showError);
}
