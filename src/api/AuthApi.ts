import {axiosApi, USER_SERVICE} from "../http/axios";
import {TAuthToken} from "../entities/types/TAuthToken";


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