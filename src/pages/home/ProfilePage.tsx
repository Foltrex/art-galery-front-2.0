import React from 'react';
import {Box, Divider, Grid, Typography} from "@mui/material";
import {TokenService} from "../../services/TokenService";
import {Container} from "@mui/system";
import {useGetAccountById} from "../../api/AccountApi";
import ProfileImage from "./ProfileImage";

const ProfilePage = () => {

    const accountId = TokenService.getCurrentAccountId();
    const {data: account} = useGetAccountById(accountId);

    return (
        <Container>
            <Box sx={{mt: 6}}>
                <ProfileImage/>
            </Box>
            <Box sx={{textAlign: 'center', width: '40%', mt: 4, mx: 'auto'}}>
                <Typography variant='h4'>
                    {account?.firstname}{' '}{account?.lastname}{' '}
                    {/* <Button onClick={() => setOpenEditForm(true)}>Edit</Button> */}
                </Typography>

                <Divider sx={{mx: 'auto'}}/>

                <Grid container justifyContent='center' sx={{mt: 4}}>
                    <Grid item sm={4}><strong>Email</strong></Grid>
                    <Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ProfilePage;
