import { Address } from "../entities/address";
import { ART_SERVICE, axiosApi } from "../http/axios";

export class AddressApi {

    static getAllAddressesByCityId(id: string) {
        return axiosApi.get<Array<Address>>(`${ART_SERVICE}/addresses/city/${id}`)
    }
}