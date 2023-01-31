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

}