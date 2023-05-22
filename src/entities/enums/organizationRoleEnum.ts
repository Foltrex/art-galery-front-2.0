export enum OrganizationRoleEnum {
    CREATOR = "CREATOR",
    MODERATOR = "MODERATOR",
    MEMBER = "MEMBER",
}
export function  roleToString(role:OrganizationRoleEnum) {
    switch (role) {
        case OrganizationRoleEnum.CREATOR:
            return "Owner";
        case OrganizationRoleEnum.MODERATOR:
            return "Organization admin"
        case OrganizationRoleEnum.MEMBER:
            return "Facility admin"
        default:
            return "Unknown";
    }
}