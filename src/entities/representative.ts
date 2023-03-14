import {Organization} from "./organization";
import {Facility} from "./facility";
import {OrganizationRole} from "./organizationRole";

export interface Representative {
    id: string,
    firstname: string,
    lastname: string,
    organization: Organization,
    facility: Facility,
    organizationRole: OrganizationRole,
    accountId: string
}