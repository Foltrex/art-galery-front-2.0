import {ART_SERVICE, axiosApi} from "../http/axios";
import {Artist} from "../entities/artist";
import { useFetch, useUpdate } from "../hooks/react-query";

export const useGetArtistByAccountId = (accountId: string) => {
    return useFetch<Artist>(`${ART_SERVICE}/artists/accounts/${accountId}`);
}

export const useUpdateArtistById = (artist: Artist, artistId: string) => {
    return useUpdate<Artist>(`${ART_SERVICE}/artists/${artistId}`, artist);
}

export class ArtistApi {

    static getArtistByAccountId(accountId: string) {
        return axiosApi.get<Artist>(`${ART_SERVICE}/artists/accounts/${accountId}`);
    }

    static updateArtistById(artist: Artist, artistId: string) {
        return axiosApi.put<Artist>(`${ART_SERVICE}/artists/${artistId}`, artist);
    }

}
