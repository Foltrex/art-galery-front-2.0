import {axiosApi} from "../http/axios";

const BASE_URL = "https://nominatim.openstreetmap.org/search?";

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
