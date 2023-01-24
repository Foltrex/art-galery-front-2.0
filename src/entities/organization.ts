import {Address} from "./address";
import {OrganizationStatusEnum} from "./enums/organizationStatusEnum";
import {Facility} from "./facility";

export interface Organization {
    id: string,
    name: string | null,
    address: Address | null,
    status: OrganizationStatusEnum,
    facilities: Facility[]
}