import {Grid} from "@mui/material";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import React, {useMemo, useState} from "react";
import {Account} from "../../../entities/account";
import {Metadata} from "../../../entities/metadata";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {find, findOrganizationId} from "../../../util/MetadataUtil";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {OrganizationRoleEnum} from "../../../entities/enums/organizationRoleEnum";
import {useRootStore} from "../../../stores/provider/RootStoreProvider";

export const AbstractUserPage = ({account, onSubmit, back, organizationId}:{organizationId?:string, account:Account, onSubmit:(a:Account) => Promise<boolean>, back?:() => void}) => {
    const [image, setImage] = useState<Metadata|null>();

    const {authStore} = useRootStore();
    const isBoss = useMemo(() => {
        //person 1 - current logged user
        //person 2 - user who is shown in form

        //check, if both persons are representative
        if (authStore.account.accountType !== AccountEnum.REPRESENTATIVE || account.accountType !== AccountEnum.REPRESENTATIVE) {
            return false;
        }
        //check if both persons belong to same organization
        if (findOrganizationId(authStore.account) !== findOrganizationId(account)) {
            return false;
        }
        //if current person is organization creator, he can edit any user
        const bossRole = find(MetadataEnum.ORGANIZATION_ROLE, authStore.account);
        if (bossRole === OrganizationRoleEnum.CREATOR) {
            return true;
        }
        //if current user is moderator, and current user in form is member, can edit as well.
        //so, moderator can edit only members
        const workerRole = find(MetadataEnum.ORGANIZATION_ROLE, account);
        return bossRole === OrganizationRoleEnum.MODERATOR && workerRole === OrganizationRoleEnum.MEMBER;
    }, [authStore.account, account])

    const canEdit = authStore.account.accountType === AccountEnum.SYSTEM
        || authStore.account.id === account.id
        || isBoss

    return <Grid>
        <Grid sx={{mt: 6}}>
            <ProfileImage canEdit={canEdit} account={account} imageUpdated={setImage}/>
        </Grid>
        <Grid sx={{textAlign: 'center', mt: 4, mx: 'auto'}}>
            <ProfileInfo canEdit={canEdit} organizationId={organizationId} account={account} onSubmit={onSubmit} back={back} uploadedImage={image}/>
        </Grid>
    </Grid>
}