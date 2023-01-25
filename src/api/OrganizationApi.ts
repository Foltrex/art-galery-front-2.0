import {Organization} from "../entities/organization";
import {ART_SERVICE, axiosApi} from "../http/axios";

export class OrganizationApi {

    static getAllOrganizations() {
        return axiosApi.get<Array<Organization>>(`${ART_SERVICE}/organizations`);
    }

    static getOrganizationByAccountId(accountId: string) {
        console.log(accountId)
        return axiosApi.get<Organization>(`${ART_SERVICE}/organizations/accounts/${accountId}`, {
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            // }
        })
    }
}