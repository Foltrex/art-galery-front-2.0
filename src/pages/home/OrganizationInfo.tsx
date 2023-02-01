import React, {useState} from 'react';
import {Alert, Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import {Organization} from "../../entities/organization";
import OrganizationEditDialog from "./edit/OrganizationEditDialog";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {AuthService} from '../../services/AuthService';
import {TokenService} from "../../services/TokenService";

const OrganizationInfo = (props: { organization: Organization }) => {
    const organization = props.organization
    const [openEditForm, setOpenEditForm] = useState(false)

    const AlertWarning = () => {
        if (organization.status === OrganizationStatusEnum.NEW) {
            return (
                <Alert severity="warning">
                    Please, {' '}
                    <span style={{cursor: "pointer"}} onClick={() => setOpenEditForm(true)}>
                <b><u>fill</u></b>
                </span>{' '}
                    the data about your organization!
                </Alert>
            )
        } else {
            return null
        }
    }

    return (
        <div>
            <OrganizationEditDialog
                open={openEditForm}
                onClose={() => setOpenEditForm(false)}
                organization={organization}
            />
            <AlertWarning/>
            <Grid container
                  spacing={0}
                  sx={{marginTop: "4%"}}
                  justifyContent="center"
            >
                <Grid item sm={3}>
                    <img src={'/images/logo.png'} alt={'Company logo'} width='250' height='250'/>
                </Grid>
                <Grid item sm={5}>
                    <Typography variant='h4'>
                        {organization.name ? organization.name : 'The name is empty'} {' '}
                        <Button onClick={() => setOpenEditForm(true)}>Edit</Button>
                    </Typography>
                    <Divider/>
                    <Stack spacing={2} sx={{marginTop: 4}}>
                        <Grid container>
                            <Grid item sm={4}><strong>Status</strong></Grid>
                            <Grid item sm={8}>
                             <span style={{color: PrepareDataUtil.getOrganizationStatusColor(organization.status)}}>
                                {organization.status}
                             </span>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={4}><strong>Address</strong></Grid>
                            <Grid item sm={8}>
                                {organization.address ? (organization.address.fullName) : "The address is empty"}
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item sm={4}><strong>Email</strong></Grid>
                            <Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
                        </Grid>
                    </Stack>
                </Grid>
            </Grid>
        </div>
    );
};

export default OrganizationInfo;