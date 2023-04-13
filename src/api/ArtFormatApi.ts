import { ArtFormat } from "../entities/art-format";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE } from "../http/axios";

export const useGetAllArtFormats = () => {
    return useFetch<ArtFormat[]>(`${ART_SERVICE}/art-formats`);
}