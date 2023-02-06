import {USER_SERVICE} from "../http/axios";
import {TAuthToken} from "../entities/types/TAuthToken";
import {usePost} from "../hooks/react-query";
import {Representative} from "../entities/representative";

export const useRegister = () => {
    return usePost<object, TAuthToken>(`${USER_SERVICE}/auth/register`)
}

export const useLogin = () => {
    return usePost<object, TAuthToken>(`${USER_SERVICE}/auth/login`)
}

export const useRegisterRepresentative = () => {
    return usePost<object, Representative>(`${USER_SERVICE}/auth/register-representative`);
}
