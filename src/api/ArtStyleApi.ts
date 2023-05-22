import {ArtStyle} from "../entities/art-style";
import {useFetch} from "../hooks/react-query";
import {AxiosError} from "axios/index";

export const useGetAllArtStyles = (showError:(error:AxiosError) => void) => {
    return useFetch<ArtStyle[]>('art-styles','GET:art-styles',
        {},
        showError);
}