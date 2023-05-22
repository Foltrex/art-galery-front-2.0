import {ArtType} from "../entities/art-type";
import {useFetch} from "../hooks/react-query";
import {AxiosError} from "axios";

export const useGetAllArtTypes = (showError:(error:AxiosError) => void) => {
    return useFetch<ArtType[]>('art-types', 'GET:art-types',
        {},
        showError);
}