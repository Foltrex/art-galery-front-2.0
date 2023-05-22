import {ArtFormat} from "../entities/art-format";
import {useFetch} from "../hooks/react-query";
import {AxiosError} from "axios";

export const useGetAllArtFormats = (showError:(error:AxiosError) => void) => {
    return useFetch<ArtFormat[]>('art-formats', 'GET:art-formats', {}, showError);
}