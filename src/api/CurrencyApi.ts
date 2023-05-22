import {Currency} from "../entities/currency"
import {useFetch, usePost} from "../hooks/react-query"
import {AxiosError} from "axios/index";


export const useGetAllCurrencies = (showError:(error:AxiosError) => void) => {
    return useFetch<Currency[]>('currencies', 'GET:currencies', {}, showError);
}

export const useSaveCurrency = (showError:(error:AxiosError) => void) => {
    return usePost<Currency>('currencies', {}, ['GET:currencies'], showError);
}