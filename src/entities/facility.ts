import {Address} from "./address";
import {EntityFile} from "./entityFile";

export interface Facility {
    id: string,
    name: string,
    isActive: boolean,
    address: Address,
    organizationId?:string,
    organizationName?:string,
    images: EntityFile[]
}