import React from 'react';
import {Account} from "../../entities/account";
import {Box, Divider, Grid, Typography} from "@mui/material";
import MetadataList from "./MetadataList";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";


const ProfileInfo = (props: {account: Account}) => {
    console.log(props.account)
    return (
        <>
            <Typography variant='h4'>
                {props.account?.firstName}{' '}{PrepareDataUtil.convertFirstLatterToUpperCase(props.account.accountType)}
            </Typography>

            <Divider sx={{mx: 'auto'}}/>
                <Grid container justifyContent='center' sx={{mt: 4}} style={{textAlign: "left"}}>
                    <Grid item sm={4}><strong>Email</strong></Grid>
                    <Grid item sm={8}>{props.account?.email}</Grid>
                    <Grid item sm={4}><strong>Name</strong></Grid>
                    <Grid item sm={8}>{props.account?.firstName}{' '}{props.account?.lastName}</Grid>
                    <MetadataList metadata={props.account.metadata}/>
                </Grid>
        </>
    );
};

export default ProfileInfo;
