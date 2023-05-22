import {City} from "../entities/city";
import {useFetch} from "../hooks/react-query";
import {AxiosError} from "axios";


export const useGetAllCities = (showError:(errror:AxiosError) => void) => {
    return useFetch<City[]>('cities/list', 'GET:cities', {}, showError);
}

export const useGetCityById = (id:string, showError:(errror:AxiosError) => void) => {
    return useFetch<City>('cities/' + id, 'GET:cities/id', {}, showError, {enabled: !!id});
}
