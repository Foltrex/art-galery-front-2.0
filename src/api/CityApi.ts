import {City} from "../entities/city";
import {useFetch} from "../hooks/react-query";
import {ART_SERVICE} from "../http/axios";


export const useGetAllCities = () => {
    return useFetch<City[]>(`${ART_SERVICE}/cities`);
}
