import { Currency } from "../entities/currency"
import { useFetch, usePost } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"


export const useGetAllCurrencies = () => {
    return useFetch<Currency[]>(`${ART_SERVICE}/currencies`);
}

export const useSaveCurrency = () => {
    return usePost<Currency>(`${ART_SERVICE}/currencies`);
}