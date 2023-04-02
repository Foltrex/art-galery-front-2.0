import React from 'react';
import {Box, Divider, Grid, Typography} from "@mui/material";
import {Container} from "@mui/system";
import ProfileImage from "./ProfileImage";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

const ProfilePage = () => {

    const {authStore} = useRootStore();
    const account = authStore.account;

    return (
        <Container>
            <Box sx={{mt: 6}}>
                <ProfileImage account={account}/>
            </Box>
            <Box sx={{textAlign: 'center', width: '40%', mt: 4, mx: 'auto'}}>
                <Typography variant='h4'>
                    {account?.firstName}{' '}{account?.lastName}{' '}
                </Typography>

                <Divider sx={{mx: 'auto'}}/>

                <Grid container justifyContent='center' sx={{mt: 4}}>
                    <Grid item sm={4}><strong>Email</strong></Grid>
                    <Grid item sm={8}>{account?.email}</Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ProfilePage;
