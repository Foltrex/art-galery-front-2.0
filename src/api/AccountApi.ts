import {axiosApi, USER_SERVICE} from "../http/axios";
import {Representative} from "../entities/representative";
import { usePost } from "../hooks/react-query";

// tood: mutate {
//     email: email,
//     password: password,
//     organizationId: organizationId,
//     facilityId: facilityId
// }

export const useRegisterRepresentative = () => {
    return usePost<object, Representative>(`${USER_SERVICE}/accounts/register-representative`);
}