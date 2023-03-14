import {ART_SERVICE} from "../http/axios";
import {Artist} from "../entities/artist";
import {useFetch, useUpdate} from "../hooks/react-query";

export const useGetArtistByAccountId = (accountId: string) => {
    return useFetch<Artist>(`${ART_SERVICE}/artists/accounts/${accountId}`);
}

export const useGetArtistByArtId = (artId?: string) => {
    return useFetch<Artist>(
        `${ART_SERVICE}/artists/arts/${artId}`,
        undefined,
        { enabled: !!artId }
    );
}

export const useUpdateArtistById = (artistId: string) => {
    return useUpdate<Artist>(`${ART_SERVICE}/artists/${artistId}`);
}
