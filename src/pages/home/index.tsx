import {Box, CircularProgress} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Organization} from '../../entities/organization';
import {OrganizationApi} from "../../api/OrganizationApi";
import {AuthService} from "../../services/AuthService";
import OrganizationInfo from "./OrganizationInfo";

const OrganizationProfile = () => {

    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const accountId = AuthService.getCurrentAccountId()
        OrganizationApi.getOrganizationByAccountId(accountId)
            .then(response => {
                console.log(response)
                setOrganization(response.data)
            })
            .finally(() => setLoading(false))
    }, [])

    const Render = () => {
        if (loading) {
            return (
                <Box display="flex" justifyContent="center">
                    <CircularProgress/>
                </Box>
            )
        }
        return (<OrganizationInfo organization={organization}/>)
    }

    return (
        <div>
            <Render/>
        </div>
    );
};

export default OrganizationProfile;
