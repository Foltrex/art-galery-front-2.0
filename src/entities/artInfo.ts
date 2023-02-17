import { BigDecimal } from "@graphprotocol/graph-ts";
import { Art } from "./art";
import { Facility } from "./facility";
import { Organization } from "./organization";

export interface ArtInfo {
    id: string;
    art: Art;
    organization: Organization;
    facility: Facility;
    price: BigDecimal;
    comission: number;
    creationDate: Date;
    expositionDateStart: Date;
    expositionDateEnd: Date;
    status: 'INACTIVE' | 'ACTIVE' | 'SOLD' | 'RETURN';
}