import {axiosApi, USER_SERVICE} from "../http/axios";
import {Representative} from "../entities/representative";
import { usePost } from "../hooks/react-query";

export const useRegisterRepresentative = (email: string, password: string, organizationId: string, facilityId: string) => {
    return usePost<Representative>(
        `${USER_SERVICE}/accounts/register-representative`,
        {
            email: email,
            password: password,
            organizationId: organizationId,
            facilityId: facilityId
        }
    );
}

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