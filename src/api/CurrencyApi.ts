import { Currency } from "../entities/currency"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"


export const useGetAllCurrencies = () => {
    return useFetch<Currency[]>(`${ART_SERVICE}/currencies`);
}