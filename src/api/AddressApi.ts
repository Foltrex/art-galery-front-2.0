import { Address } from "../entities/address";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE, axiosApi } from "../http/axios";

export const useGetAllAddressesByCityId = (id: string) => {
    return useFetch<Address[]>(`${ART_SERVICE}/addresses/city/${id}`);
}