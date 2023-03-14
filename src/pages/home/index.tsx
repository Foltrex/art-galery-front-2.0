import * as React from 'react';
import OrganizationInfo from "./OrganizationInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {TokenService} from "../../services/TokenService";

const Profile = () => {
    const accountType = TokenService.getCurrentAccountType();

    return (
        <div>{accountType === AccountEnum.REPRESENTATIVE ? <OrganizationInfo/> : <ArtistInfo/>}</div>
    );
};

export default Profile;
