import {Facility} from "../entities/facility";
import {IPage, useDelete, useFetch, usePost} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";


export const useGetAllFacilities = (page: number = 0, size: number = 25, cityId?: string, facilityName?: string, isActive?: boolean | null, organizationId?:string) => {
    return useFetch<IPage<Facility>>(
        `${ART_SERVICE}/facilities`,
        {
            page: page,
            size: size,
            cityId: cityId,
            facilityName: facilityName,
            isActive: isActive,
            organizationId: organizationId,
        }
    );
}


export const useGetFacilitiesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Facility>>(
        `${ART_SERVICE}/facilities/page/accounts/${accountId}`,
        {
            page: page,
            size: size
        }
    )
}

export const useGetAllFacilitiesByAccountId = (accountId?: string) => {
    return useFetch<Facility[]>(
        `${ART_SERVICE}/facilities/list/accounts/${accountId}`,
        undefined,
        { enabled: !!accountId }
    );
}

export const useGetFacilityByAccountId = (accountId?: string) => {
    return useFetch<Facility>(
        `${ART_SERVICE}/facilities/accounts/${accountId}`,
        undefined,
        { enabled: !!accountId }
    );
}

export const useGetFacilityById = (id?: string) => {
    return useFetch<Facility>(
        `${ART_SERVICE}/facilities/${id}`,
        undefined,
        { enabled: !!id }
    );
}


export const useSaveFacility = () => {
    return usePost<Facility>(`${ART_SERVICE}/facilities`);
}


export const useDeleteFacility = () => {
    return useDelete(`${ART_SERVICE}/facilities`);
}
