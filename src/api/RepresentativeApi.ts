import { ART_SERVICE, axiosApi, USER_SERVICE } from "../http/axios";
import { Representative } from "../entities/representative";
import { IPage, useFetch } from "../hooks/react-query";

interface TPageableResponse {
    content: Representative[];
}

const REPRESENTATIVE_KEY = `${ART_SERVICE}/representatives`;


export const useGetRepresentativesPageByAccountId = (accountId: string, page?: number, size?: number) => {
    return useFetch<IPage<Representative>>(
        REPRESENTATIVE_KEY,
        `${ART_SERVICE}/representatives/account/${accountId}`,
        {
            page: page,
            size: size
        })
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