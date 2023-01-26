import {CircularProgress} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Organization} from '../../entities/organization';
import {OrganizationApi} from "../../api/OrganizationApi";
import {AuthService} from "../../services/AuthService";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import OrganizationInfo from "./form/OrganizationInfo";
import OrganizationEditForm from "./form/OrganizationEditForm";

const OrganizationProfile = () => {

    const [organization, setOrganization] = useState<Organization>({} as Organization)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const accountId = AuthService.getCurrentAccountId()
        OrganizationApi.getOrganizationByAccountId(accountId)
            .then(response => {
                setOrganization(response.data)
                setLoading(false)
            })
    }, [])

    const Render = () => {
        if (loading) {
            return <CircularProgress/>
        }

        if (organization.status === OrganizationStatusEnum.NEW) {
            return <OrganizationEditForm/>
        } else {
            return <OrganizationInfo organization={organization}/>
        }

    }

    return (
        <div>
            <Render/>
        </div>
    );
};

export default OrganizationProfile;
