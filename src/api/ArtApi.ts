import { Art } from "../entities/art"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios";

export const useGetArtById = (id: string) => {
    return useFetch<Art>(`${ART_SERVICE}/arts/${id}`);
}