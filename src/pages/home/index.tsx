import * as React from 'react';
import OrganizationInfo from "./RepresentativeInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {TokenService} from "../../services/TokenService";
import RepresentativeInfo from './RepresentativeInfo';

const Profile = () => {
    const accountType = TokenService.getCurrentAccountType();

    return (
        <div>{accountType === AccountEnum.REPRESENTATIVE ? <RepresentativeInfo/> : <ArtistInfo/>}</div>
    );
};

export default Profile;
