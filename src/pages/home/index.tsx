import * as React from 'react';
import {useEffect, useState} from 'react';
import OrganizationInfo from "./OrganizationInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {Organization} from "../../entities/organization";
import {Artist} from '../../entities/artist';
import {TokenService} from "../../services/TokenService";
import Loading from "../../components/ui/Loading";
import { useGetOrganizationByAccountId } from '../../api/OrganizationApi';
import { useGetArtistByAccountId } from '../../api/ArtistApi';

const Profile = () => {
    const accountType = TokenService.getCurrentAccountType();
    const accountId = TokenService.getCurrentAccountId();

    const { data: fetchedOrganization } = useGetOrganizationByAccountId(accountId);
    const { data: fetchedArtist } = useGetArtistByAccountId(accountId);

    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [artist, setArtist] = useState<Artist>({} as Artist)
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (fetchedOrganization) {
            setOrganization(fetchedOrganization);
        } else if (fetchedArtist) {
            setArtist(fetchedArtist);
        }

        setLoading(false);

    }, [fetchedArtist, fetchedOrganization])


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
