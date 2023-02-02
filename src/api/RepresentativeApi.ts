import { Representative } from "../entities/representative";
import { IPage, useDelete, useFetch, usePost } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";

interface TPageableResponse {
    content: Representative[];
}

export const useGetRepresentativesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Representative>>(
        `${ART_SERVICE}/representatives/account/${accountId}`,
        {
            page: page,
            size: size
        })
}

export const useDeleteRepresentative = () => {
    return useDelete<IPage<Representative>>(`${ART_SERVICE}/representatives`);
}

export const useAddRepresentative = () => {
    return usePost<IPage<Representative>, Representative>(`${ART_SERVICE}/representatives`);
}

export class RepresentativeApi {

    static getAllRepresentative(page?: number, size?: number) {
        return axiosApi.get<any>(`${ART_SERVICE}/representatives`, {
            params: {
                page: page,
                size: size,
            }
        })
    }

    static getAllRepresentativeByOrganizationId(organizationId: string, page?: number, size?: number) {
        return axiosApi.get<any>(`${ART_SERVICE}/representatives/organizations/${organizationId}`, {
            params: {
                page: page,
                size: size,
            }
        }).then(response => response.data)
    }


    static deleteById(id: string) {
        return axiosApi.delete<any>(`${ART_SERVICE}/representatives/${id}`);
    }

}