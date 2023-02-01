import {Address} from "./address";

export interface Artist {
    id: string,
    firstname: string,
    lastname: string,
    accountId: string,
    address: Address
}