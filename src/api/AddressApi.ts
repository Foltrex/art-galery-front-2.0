import { Address } from "../entities/address";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE } from "../http/axios";

export const useGetAllAddressesByCityId = (id: string) => {
    return useFetch<Address[]>(`${ART_SERVICE}/addresses/city/${id}`);
}