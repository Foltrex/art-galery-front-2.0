import {Account} from "../../../entities/account";
import {useMemo} from "react";
import {find} from "../../../util/MetadataUtil";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";

export const AccountRole = ({account}:{account:Account}) => {
    const role = useMemo(() => find(MetadataEnum.ORGANIZATION_ROLE, account), [account])
    return <span>{role}</span>;
}