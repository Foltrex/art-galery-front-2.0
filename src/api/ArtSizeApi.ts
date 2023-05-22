import {ArtSize} from "../entities/art-size"
import {useFetch} from "../hooks/react-query"
import {AxiosError} from "axios";

export const useGetAllArtSizes = (showError:(error:AxiosError) => void) => {
    return useFetch<ArtSize[]>('art-sizes',
        'GET:art-sizes',
        {},
        showError
    );
}