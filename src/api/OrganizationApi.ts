import {Organization} from "../entities/organization";
import {ART_SERVICE, axiosApi} from "../http/axios";

const API = `${ART_SERVICE}/organizations`;

export class OrganizationApi {

    static getAllOrganizations() {
        return axiosApi.get<Array<Organization>>(`${API}`);
    }

    static getOrganizationByAccountId(accountId: string) {
        console.log(accountId)
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