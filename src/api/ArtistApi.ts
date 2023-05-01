import {ART_SERVICE} from "../http/axios";
import {Artist} from "../entities/artist";
import {IPage, useFetch, usePost, useUpdate} from "../hooks/react-query";
import {Account} from "../entities/account";

export const useGetArtistById = (id?: string) => {
    return useFetch<Artist>(`${ART_SERVICE}/artists/${id}`, undefined, { enabled: !!id });
}

// export const useGetArtistByAccountId = (accountId?: string) => {
//     return useFetch<Artist>(
//         `${ART_SERVICE}/artists/accounts/${accountId}`, 
//         undefined, 
//         { enabled: !!accountId, retry: false }
//     );
// }

export const useGetArtists = (params:{page:number, size: number}) => {
    return useFetch<IPage<Artist>>(
        `${ART_SERVICE}/artists`,
        params,
        { enabled: true, retry: false }
    );
}

export const useGetArtistByArtId = (artId?: string) => {
    //todo not checked, previously was Artist
    return useFetch<Account>(
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
