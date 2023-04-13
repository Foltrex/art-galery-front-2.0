import { ArtType } from "../entities/art-type";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE } from "../http/axios";

export const useGetAllArtTypes = () => {
    return useFetch<ArtType[]>(`${ART_SERVICE}/art-types`);
}