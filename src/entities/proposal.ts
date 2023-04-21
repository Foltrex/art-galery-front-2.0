import {Art} from "./art";
import {Artist} from "./artist";
import {Currency} from "./currency";
import {Facility} from "./facility";

export interface Proposal {
    id?: string;
    art: Art;
    price: string;
    commission: number;
    currency: Currency;
    artist: Artist;
    organizationId: string;
    organizationName: string;
    facility: Facility;
    artistConfirmation?: boolean;
    organizationConfirmation?: boolean;
}