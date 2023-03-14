
import Big from "big.js";
import { Art } from "./art";
import { Currency } from "./currency";
import { Facility } from "./facility";
import { Organization } from "./organization";

export interface ArtInfo {
    id: string;
    art: Art;
    organization: Organization;
    facility: Facility;
    price: string;
    currency: Currency;
    comission: number;
    creationDate: Date;
    expositionDateStart: Date;
    expositionDateEnd: Date;
    status: 'INACTIVE' | 'ACTIVE' | 'SOLD' | 'RETURN';
}