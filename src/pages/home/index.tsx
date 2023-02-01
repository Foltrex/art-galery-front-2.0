import * as React from 'react';
import {AuthService} from "../../services/AuthService";
import OrganizationInfo from "./OrganizationInfo";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtistInfo from "./ArtistInfo";
import {useEffect, useState} from "react";
import {Organization} from "../../entities/organization";
import {OrganizationApi} from "../../api/OrganizationApi";
import {Box, CircularProgress} from "@mui/material";
import { Artist } from '../../entities/artist';
import {ArtistApi} from "../../api/ArtistApi";
import {TokenService} from "../../services/TokenService";

const OrganizationProfile = () => {
    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [artist, setArtist] = useState<Artist>({} as Artist)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const accountId = TokenService.getCurrentAccountId()
        if (accountType === AccountEnum.REPRESENTATIVE) {
            OrganizationApi.getOrganizationByAccountId(accountId)
                .then(response => {
                    console.log(response)
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

    const accountType = TokenService.getCurrentAccountType();

    const Render = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            )
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

export default OrganizationProfile;
