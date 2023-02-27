import { ArtInfo } from "../entities/artInfo"
import { useFetch } from "../hooks/react-query"
import { ART_SERVICE } from "../http/axios"

export const useGetArtInfosByAccountId = (artId: string) => {
    return useFetch<ArtInfo[]>(`${ART_SERVICE}/art-infos/art/${artId}`);
}