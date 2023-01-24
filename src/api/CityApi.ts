import { City } from "../entities/city";
import { ART_SERVICE, axiosApi } from "../http/axios";


export class CityApi {

    static getAllCities() {
        return axiosApi.get<Array<City>>(`${ART_SERVICE}/cities`);
    } 
}