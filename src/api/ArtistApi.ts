import {ART_SERVICE, axiosApi} from "../http/axios";
import {Artist} from "../entities/artist";


export class ArtistApi {

    static getArtistByAccountId(accountId: string) {
        return axiosApi.get<Artist>(`${ART_SERVICE}/artists/accounts/${accountId}`);
    }

}