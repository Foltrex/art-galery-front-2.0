import { Artist } from "./artist";

export interface Art {
    id?: string;
    name: string;
    description: string;
    artist: Artist;
}