import {Account} from "../entities/account";
import {TAuthToken} from "../entities/types/TAuthToken";
import {usePost} from "../hooks/react-query";
import {AxiosError} from "axios/index";

export const useRegister = (showError:(errror:AxiosError) => void) => {
    return usePost<object, TAuthToken>('auth/register', {}, ['GET:accounts', 'GET:accounts/id', 'GET:cities', 'GET:cities/id'], showError)
}

export const useLogin = (showError:(errror:AxiosError) => void) => {
    return usePost<object, TAuthToken>('auth/login', {}, ['GET:accounts', 'GET:accounts/id', 'GET:cities', 'GET:cities/id'], showError)
}

export const useRegisterUser = (showError:(errror:AxiosError) => void) => {
    return usePost<object, Account>('auth/register-user', {}, ['GET:accounts', 'GET:accounts/id', 'GET:cities', 'GET:cities/id'], showError);
}

export const useSendPasswordRecoveryCode = (showError:(errror:AxiosError) => void) => {
    return usePost('auth/password-recovery-code', {}, [], showError);
}

export const usePasswordRecovery = (showError:(errror:AxiosError) => void) => {
    return usePost('auth/password-recovery', {}, [], showError);
}
