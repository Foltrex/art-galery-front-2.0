import { Art } from "./art";
import { Artist } from "./artist";
import { Currency } from "./currency";
import { Facility } from "./facility";
import { Organization } from "./organization";

export interface Proposal {
    id?: string;
    art: Art;
    price: string;
    comission: number;
    currency: Currency;
    artist: Artist;
    organization: Organization;
    facility: Facility;
    artistConfirmation: boolean;
    organizationConfirmation: boolean;
}