import {Art} from "./art";
import {Currency} from "./currency";
import {Facility} from "./facility";
import {Account} from "./account";
import {Organization} from "./organization";

export interface Proposal {
    id: string;
    art: Art;
    price: number;
    commission: number;
    comment?: string;
    currency: Currency;
    artist: Account;
    organization: Organization;
    facilities: Facility[];
    artistConfirmation?: boolean;
    organizationConfirmation?: boolean;
}