import * as React from 'react';
import RepresentativeInfo from "./RepresentativeInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {TokenService} from "../../services/TokenService";
import SystemInfo from "./SystemInfo";

const Profile = () => {
    const accountType = TokenService.getCurrentAccountType();
    switch (accountType) {
        case AccountEnum.REPRESENTATIVE:
            return <RepresentativeInfo/>;
        case AccountEnum.ARTIST:
            return <ArtistInfo/>;
        case AccountEnum.SYSTEM:
            return <SystemInfo/>
        default:
            return <div/>;
    }
};

export default Profile;
