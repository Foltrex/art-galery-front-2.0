import {OrganizationStatusEnum} from "../entities/enums/organizationStatusEnum";

export class PrepareDataUtil {

    static getOrganizationStatusColor = (status: OrganizationStatusEnum) => {
        switch (status) {
            case OrganizationStatusEnum.INACTIVE:
                return "red"
            case OrganizationStatusEnum.NEW:
                return "orange"
            case OrganizationStatusEnum.ACTIVE:
                return "green"
        }
    }

    static convertFirstLatterToUpperCase = (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

}
