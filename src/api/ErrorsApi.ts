import {axiosApi} from "../http/axios";
import {IPage, useDelete, useFetch, useUpdate} from "../hooks/react-query";
import {UiError} from "../entities/uiError";
import {AxiosError} from "axios";


export const useGetAll = (
    filter: {
        page: number,
        size: number,
        status?: string
        sort?: string
        update: boolean
    },
    showError:(error:AxiosError) => void
) => {
    return useFetch<IPage<UiError>>('errors', 'GET:errors', filter, showError, {
        retry: false
    });
}

export const updateError = (errorId:string|undefined, showError:(errror:AxiosError) => void) => {
    return useUpdate<UiError>(`errors/${errorId}`, {}, ['GET:errors'], showError, {
        enabled: !!errorId
    });
}

 export const createError = (error:UiError) => {
     return axiosApi.post<void>(`errors`, error, {});
 }

 export const deleteError = (errorId:string|undefined, showError:(errror:AxiosError) => void) => {
     return useDelete(`errors/${errorId}`, {}, ['GET:errors'], showError, {
         enabled: !!errorId
     });
 }
