import { ArtStyle } from "../entities/art-style";
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE } from "../http/axios";

export const useGetAllArtStyles = () => {
    return useFetch<ArtStyle[]>(`${ART_SERVICE}/art-styles`);
}