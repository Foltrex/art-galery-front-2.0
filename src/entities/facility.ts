import {Address} from "./address";

export interface Facility {
    id: string,
    name: string,
    isActive: boolean,
    address: Address,
    organizationId?:string,
    organizationName?:string
}