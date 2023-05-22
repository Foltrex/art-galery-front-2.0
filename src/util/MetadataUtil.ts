import {Account} from "../entities/account";
import {MetadataEnum} from "../entities/enums/MetadataEnum";
import {OrganizationRoleEnum} from "../entities/enums/organizationRoleEnum";
import {Metadata} from "../entities/metadata";

export function findMetadata(key:string, account:Account):Metadata|null {
    if(!account || !account.metadata) {
        return null;
    }
    for(let i = 0; i < account.metadata.length; i++) {
        if(account.metadata[i].key === key) {
            return account.metadata[i];
        }
    }
    return null;
}
export function find(key:string, account:Account):string|null {
    const object = findMetadata(key, account);
    return object ? object.value : null;
}

export function isCreatorOrAdmin(account:Account) {
    const role = find(MetadataEnum.ORGANIZATION_ROLE, account);
    return role === OrganizationRoleEnum.CREATOR || role === OrganizationRoleEnum.MODERATOR;
}
export function findOrganizationId(account:Account) {
    return find(MetadataEnum.ORGANIZATION_ID, account);
}

export function findFacilityId(account:Account) {
    return find(MetadataEnum.FACILITY_ID, account);
}