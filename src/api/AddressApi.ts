import { Address } from "../entities/address";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";

export const useGetAllAddressesByCityId = (id: string) => {
    return useFetch<Address[]>(`${ART_SERVICE}/addresses/city/${id}`);
}

export class AddressApi {

    static getAllAddressesByCityId(id: string) {
        return axiosApi.get<Address[]>(`${ART_SERVICE}/addresses/city/${id}`)
    }
}