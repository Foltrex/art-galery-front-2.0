import {Account} from "../entities/account";

export function find(key:string, account:Account):string|null {
    if(!account || !account.metadata) {
        return null;
    }
    for(let i = 0; i < account.metadata.length; i++) {
        if(account.metadata[i].key === key) {
            return account.metadata[i].value;
        }
    }
    return null;
}

export function isCreatorOrAdmin(account:Account) {
    const role = find("organizationRole", account);
    return role === 'CREATOR' || role === 'ADMIN';
}
export function findOrganizationId(account:Account) {
    return find("organizationId", account);
}