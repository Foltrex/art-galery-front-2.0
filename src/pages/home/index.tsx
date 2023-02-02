import * as React from 'react';
import {useEffect, useState} from 'react';
import OrganizationInfo from "./OrganizationInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {Organization} from "../../entities/organization";
import {OrganizationApi} from "../../api/OrganizationApi";
import {Artist} from '../../entities/artist';
import {ArtistApi} from "../../api/ArtistApi";
import {TokenService} from "../../services/TokenService";
import Loading from "../../components/ui/Loading";

const Profile = () => {
    const accountType = TokenService.getCurrentAccountType();
    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [artist, setArtist] = useState<Artist>({} as Artist)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const accountId = TokenService.getCurrentAccountId()
        if (accountType === AccountEnum.REPRESENTATIVE) {
            OrganizationApi.getOrganizationByAccountId(accountId)
                .then(response => {
                    setOrganization(response.data)
                })
                .finally(() => setLoading(false))
        } else {
            ArtistApi.getArtistByAccountId(accountId)
                .then(response => {
                    setArtist(response.data);
                })
                .finally(() => setLoading(false))
        }
    }, [])


    const Render = () => {
        if (loading) {
            return (<Loading/>)
        }

        if (accountType === AccountEnum.REPRESENTATIVE) {
            return (<OrganizationInfo organization={organization}/>)
        } else {
            return (<ArtistInfo artist={artist}/>)
        }

    }

    return (
        <div>
            <Render/>
        </div>
    );
};

export default Profile;
