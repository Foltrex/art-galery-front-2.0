import {ART_SERVICE, axiosApi} from "../http/axios";
import {IPage, useFetch} from "../hooks/react-query";
import {AuthService} from "../services/AuthService";
import {UiError} from "../entities/uiError";


export const useGetAll = (
    filter: {
        page: number,
        size: number,
        status?: string
        sort?: string
        update: boolean
}) => {
    return useFetch<IPage<UiError>>(`${ART_SERVICE}/errors`, filter, {
        retry: false
    });
}

export const updateError = (error:UiError) => {
    return axiosApi.put<void>(`${ART_SERVICE}/errors/${error.id}`, error, {
        headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`,
        }
    });
}

 export const createError = (error:UiError) => {
     return axiosApi.post<void>(`${ART_SERVICE}/errors/`, error, {});
 }

 export const deleteError = (error:UiError) => {
     return axiosApi.delete<void>(`${ART_SERVICE}/errors/${error.id}`, {});
 }
