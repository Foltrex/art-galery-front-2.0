import {Account} from "../../../entities/account";
import {useMemo} from "react";
import {find} from "../../../util/MetadataUtil";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {options} from "../../../components/form/OrganizationRoleDropdown";

export const AccountRole = ({account}:{account:Account}) => {
    const role = useMemo(() => {
        const role = find(MetadataEnum.ORGANIZATION_ROLE, account);
        for(let i = 0; i < options.length; i++) {
            if(options[i].id === role) {
                return options[i].label
            }
        }
        return '';
    }, [account])
    return <span>{role}</span>;
}