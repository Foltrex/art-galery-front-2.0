import { ArtSize } from "../entities/art-size"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios";

export const useGetAllArtSizes = () => {
    return useFetch<ArtSize[]>(`${ART_SERVICE}/art-sizes`);
}