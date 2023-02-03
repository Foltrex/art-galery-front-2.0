import {Organization} from "../entities/organization";
import { useFetch, useUpdate } from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

export const useGetOrganizationByAccountId = (accountId: string) => {
    return useFetch<Organization>(`${API}/accounts/${accountId}`);
}

export const useGetAllOrganizations = () => {
    return useFetch<Organization[]>(`${API}`)
}

export const useUpdateOrganizationById = (organization: Organization, organizationId: string) => {
    return useUpdate<Organization>(`${API}/${organizationId}`, organization);
}

export class OrganizationApi {

    static getAllOrganizations() {
        return axiosApi.get<Array<Organization>>(`${API}`);
    }

    static getOrganizationByAccountId(accountId: string) {
        return axiosApi.get<Organization>(`${API}/accounts/${accountId}`, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            // }
        })
    }

    static updateOrganizationById(organization: Organization, organizationId: string) {
        return axiosApi.put<Organization>(`${API}/${organizationId}`, organization,
            {
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // }
            })
    }
}
