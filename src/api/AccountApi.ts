import {axiosApi, USER_SERVICE} from "../http/axios";
import {Representative} from "../entities/representative";

export class AccountApi {

    static registerRepresentative(email: string, password: string, organizationId: string, facilityId: string) {
        return axiosApi.post<Representative>(`${USER_SERVICE}/accounts/register-representative`, {
            email: email,
            password: password,
            organizationId: organizationId,
            facilityId: facilityId,
        })
    }
}