import {axiosApi} from "../http/axios";
import {IPage, useFetch} from "../hooks/react-query";
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

 export const createError = (error:UiError) => {
     return axiosApi.post<void>(`errors`, error, {});
 }
