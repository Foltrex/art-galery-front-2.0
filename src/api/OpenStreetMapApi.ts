import {useFetch} from "../hooks/react-query";
import {GeoPosition} from "../components/map/SearchBox";

const BASE_URL = "https://nominatim.openstreetmap.org/search";

export const useSearch = (searchText: string) => {
    return useFetch<GeoPosition[]>(BASE_URL, {
        q: searchText,
        format: "json",
        addressdetails: "1",
        polygon_geojson: "0",
    });
}
