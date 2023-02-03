import { axiosApi, USER_SERVICE } from "../http/axios";
import { TAuthToken } from "../entities/types/TAuthToken";
import { usePost } from "../hooks/react-query";

export const useRegister = () => {
    return usePost<object, TAuthToken>(`${USER_SERVICE}/auth/register`)
}

export const useLogin = () => {
    return usePost<object, TAuthToken>(`${USER_SERVICE}/auth/login`)
}