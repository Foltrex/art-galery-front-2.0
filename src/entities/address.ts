import {City} from "./city";

export interface Address {
    id?: string,
    city: City,
    fullName: string,
}