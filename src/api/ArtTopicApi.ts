import {ArtTopic} from "../entities/art-topic"
import {useFetch} from "../hooks/react-query";
import {AxiosError} from "axios";

export const useGetAllArtTopic = (showError:(error:AxiosError) => void) => {
    return useFetch<ArtTopic[]>('art-topics', 'GET:art-topics',
        {},
        showError);
}