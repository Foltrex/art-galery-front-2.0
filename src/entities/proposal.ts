import {Art} from "./art";
import {Currency} from "./currency";
import {Facility} from "./facility";
import {Account} from "./account";

export interface Proposal {
    id?: string;
    art: Art;
    price: string;
    commission: number;
    currency: Currency;
    artist: Account;
    organizationId: string;
    organizationName: string;
    facility: Facility;
    artistConfirmation?: boolean;
    organizationConfirmation?: boolean;
}