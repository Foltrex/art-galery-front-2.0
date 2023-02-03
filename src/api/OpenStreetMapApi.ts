import { useFetch } from "../hooks/react-query";
import {axiosApi} from "../http/axios";

const BASE_URL = "https://nominatim.openstreetmap.org/search?";

export const useSearch = (searchText: string) => {
    const params = {
        q: searchText,
        format: "json",
        addressdetails: "1",
        polygon_geojson: "0",
    };

    const queryString = new URLSearchParams(params).toString();
    return useFetch<any>(`${BASE_URL}${queryString}`);
}

export class OpenStreetMapApi {

    static search(searchText: string) {
        const params = {
            q: searchText,
            format: "json",
            addressdetails: "1",
            polygon_geojson: "0",
        };

        const queryString = new URLSearchParams(params).toString();
        return axiosApi.get<any>(`${BASE_URL}${queryString}`)
    }

}
