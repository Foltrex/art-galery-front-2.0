import React, {useState} from 'react';
import {Alert, Box, Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import OrganizationEditDialog from "./edit/OrganizationEditDialog";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {TokenService} from "../../services/TokenService";
import Loading from "../../components/ui/Loading";
import {useGetOrganizationByAccountId} from "../../api/OrganizationApi";

const OrganizationInfo = () => {
    const accountId = TokenService.getCurrentAccountId();
    const [openEditForm, setOpenEditForm] = useState(false)
    const {data: organization, isLoading, isIdle, isError, error} = useGetOrganizationByAccountId(accountId);

    if (isLoading || isIdle) {
        return <Loading/>
    }
    if (isError) {
        return <Box display="flex" justifyContent="center">Error: {error.message}</Box>
    }

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

    const Render = () => {
        return (
            <div>
                <OrganizationEditDialog
                    open={openEditForm}
                    onClose={() => setOpenEditForm(false)}
                    organization={organization}
                />
                <AlertWarning/>
                <Box display="flex" justifyContent="center">
                    <Grid
                        sx={{marginTop: "4%", width: "50vw"}}
                        justifyContent="center"
                    >
                        <Grid item sm={12}>
                            <Typography variant='h4'>
                                {organization.name}{' '}
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
                                        {organization.address ? (organization.address.fullName) : "empty"}
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item sm={4}><strong>Email</strong></Grid>
                                    <Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        );
    }

    return (
        <div><Render/></div>
    )

};

export default OrganizationInfo;
