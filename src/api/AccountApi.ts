import {USER_SERVICE} from "../http/axios";
import {useDelete} from "../hooks/react-query";
import {AuthService} from "../services/AuthService";

export const useDeleteAccountById = () => {
    return useDelete(`${USER_SERVICE}/accounts`, undefined, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}
