import {Organization} from "../../../entities/organization";
import {PrepareDataUtil} from "../../../util/PrepareDataUtil";
import * as React from "react";

export function OrganizationStatus({organization}: { organization: Organization }) {
    if (!organization || !organization.status) {
        return null;
    }
    return <span style={{color: PrepareDataUtil.getOrganizationStatusColor(organization.status)}}>
        {organization.status}
    </span>
}
