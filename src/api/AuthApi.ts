import { axiosApi, USER_SERVICE } from "../http/axios";
import { TAuthToken } from "../entities/types/TAuthToken";
import { usePost } from "../hooks/react-query";

export const useRegister = (email: string, password: string, accountType: string) => {
    return usePost<TAuthToken>(
        `${USER_SERVICE}/auth/register`,
        {
            email: email,
            password: password,
            accountType: accountType,
        }
    )
}

export const useLogin = (email: string, password: string) => {
    return usePost<TAuthToken>(
        `${USER_SERVICE}/auth/login`,
        {
            email: email,
            password: password
        }
    )
}

export class AuthApi {

    static register(email: string, password: string, accountType: string) {
        return axiosApi.post<TAuthToken>(`${USER_SERVICE}/auth/register`, {
            email: email,
            password: password,
            accountType: accountType,
        })
    }

    static login(email: string, password: string) {
        return axiosApi.post<TAuthToken>(`${USER_SERVICE}/auth/login`, {
            email: email,
            password: password
        })
    }

}