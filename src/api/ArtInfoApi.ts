import {ArtInfo} from "../entities/artInfo"
import {useFetch} from "../hooks/react-query"
import {AxiosError} from "axios/index";


export const useGetArtInfosByArtId = (artId: string|undefined, showError:(error:AxiosError) => void) => {
    return useFetch<ArtInfo[]>(
        `art-infos/arts/${artId}`,
        'GET:art-infos/arts/id',
        {},
        showError,
        { enabled: !!artId }
    );
}