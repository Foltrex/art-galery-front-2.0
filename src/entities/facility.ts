import {Address} from "./address";
import {Organization} from "./organization";

export interface Facility {
    id: string,
    name: string,
    isActive: boolean,
    address: Address,
    organization: Organization
}