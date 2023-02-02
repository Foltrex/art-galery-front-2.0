import {Organization} from "../entities/organization";
import { useFetch } from "../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

const ORGANIZATION_KEY = `${ART_SERVICE}/organizations`;

export const useGetOrganizationByAccountId = (accountId: string) => {
    return useFetch<Organization>(ORGANIZATION_KEY, `${API}/accounts/${accountId}`);
}

export class OrganizationApi {

    static getAllOrganizations() {
        return axiosApi.get<Array<Organization>>(`${API}`);
    }

    static getOrganizationByAccountId(accountId: string) {
        console.log("getOrganizationByAccountId")
        return axiosApi.get<Organization>(`${API}/accounts/${accountId}`, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            // }
        })
    }

    static updateOrganizationById(organization: Organization, organizationId: string) {
        console.log(organization)
        return axiosApi.put<Organization>(`${API}/${organizationId}`, organization,
            {
                // headers: {
                //     'Authorization': `Bearer ${token}`,
                // }
            })
    }
}