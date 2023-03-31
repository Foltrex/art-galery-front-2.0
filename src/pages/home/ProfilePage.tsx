import React from 'react';
import {Box, Divider, Grid, Typography} from "@mui/material";
import {TokenService} from "../../services/TokenService";
import {Container} from "@mui/system";
import {useGetAccountById} from "../../api/AccountApi";
import ProfileImage from "./ProfileImage";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";

const ProfilePage = () => {

    const accountId = TokenService.getCurrentAccountId();
    const {data: account, isLoading, isIdle, isError, error} = useGetAccountById(accountId);

    if (isLoading || isIdle) {
        return <Loading/>
    }

    if (isError) {
        return <Error message={error.message}/>
    }

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
