import { ArtTopic } from "../entities/art-topic"
import { useFetch } from "../hooks/react-query";
import { ART_SERVICE } from "../http/axios"

export const useGetAllArtTopic = () => {
    return useFetch<ArtTopic[]>(`${ART_SERVICE}/art-topics`);
}