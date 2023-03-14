import { ArtInfo } from "../entities/artInfo"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"


export const useGetLastArtInfoByArtId = (artId?: string) => {
    return useFetch<ArtInfo>(
        `${ART_SERVICE}/art-infos/last/arts/${artId}`,
        undefined,
        { enabled: !!artId }
    );
}

export const useGetArtInfosByArtId = (artId?: string) => {
    return useFetch<ArtInfo[]>(
        `${ART_SERVICE}/art-infos/arts/${artId}`,
        undefined,
        { enabled: !!artId }
    );
}