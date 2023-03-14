import {ART_SERVICE} from "../http/axios";
import {Artist} from "../entities/artist";
import {useFetch, usePost, useUpdate} from "../hooks/react-query";

export const useGetArtistById = (id?: string) => {
    return useFetch<Artist>(`${ART_SERVICE}/artists/${id}`, undefined, { enabled: !!id });
}

export const useGetArtistByAccountId = (accountId?: string) => {
    return useFetch<Artist>(
        `${ART_SERVICE}/artists/accounts/${accountId}`, 
        undefined, 
        { enabled: !!accountId, retry: false }
    );
}

export const useGetArtistByArtId = (artId?: string) => {
    return useFetch<Artist>(
        `${ART_SERVICE}/artists/arts/${artId}`,
        undefined,
        { enabled: !!artId }
    );
}

export const useSaveArtist = () => {
    return usePost<Artist>(`${ART_SERVICE}/artists`);
}

export const useUpdateArtistById = (artistId?: string) => {
    return useUpdate<Artist>(`${ART_SERVICE}/artists/${artistId}`, undefined, { enabled: !!artistId });
}
