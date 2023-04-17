import { Account } from "../entities/account";
import { TAuthToken } from "../entities/types/TAuthToken";
import { usePost } from "../hooks/react-query";
import { ART_SERVICE, USER_SERVICE } from "../http/axios";

export const useRegister = () => {
    return usePost<object, TAuthToken>(`${ART_SERVICE}/auth/register`)
}

export const useLogin = () => {
    return usePost<object, TAuthToken>(`${USER_SERVICE}/auth/login`)
}

export const useRegisterUser = () => {
    return usePost<object, Account>(`${ART_SERVICE}/auth/register-user`);
}

export const useSendPasswordRecoveryCode = () => {
    return usePost(`${USER_SERVICE}/auth/password-recovery-code`);
}

export const usePasswordRecovery = () => {
    return usePost(`${USER_SERVICE}/auth/password-recovery`);
}
