import React from 'react';
import {Account} from "../../entities/account";
import {Divider, Grid, Typography} from "@mui/material";
import MetadataList from "./MetadataList";

const ProfileInfo = (props: {account: Account}) => {
    return (
        <>
            <Typography variant='h4'>
                {props.account?.firstName}{' '}{props.account?.lastName}{' '}
            </Typography>

            <Divider sx={{mx: 'auto'}}/>

            <Grid container justifyContent='center' sx={{mt: 4}}>
                <Grid item sm={4}><strong>Email</strong></Grid>
                <Grid item sm={8}>{props.account?.email}</Grid>
                <MetadataList metadata={props.account.metadata}/>
            </Grid>
        </>
    );
};

export default ProfileInfo;
