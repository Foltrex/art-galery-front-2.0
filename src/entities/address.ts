import {City} from "./city";

export interface Address {
    id: string,
    city: City,
    streetName: string,
    streetNumber: number,
}