import {OrganizationStatusEnum} from "../entities/enums/organizationStatusEnum";
import {Address} from "../entities/address";

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

    // static parseAddress = (address: Address) => {
    //     return address.city.name + ", " + address.streetName + " " + address.streetNumber;
    // }

}