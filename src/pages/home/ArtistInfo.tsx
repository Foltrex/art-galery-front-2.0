import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {TokenService} from "../../services/TokenService";
import {useGetArtistByAccountId} from "../../api/ArtistApi";
import Loading from '../../components/ui/Loading';
import ArtistEditDialog from './edit/ArtistEditDialog';
import {Button, Divider, Grid, Stack, Typography} from '@mui/material';
import Error from "../../components/ui/Error";

const ArtistInfo = () => {
    const accountId = TokenService.getCurrentAccountId();
    const [openEditForm, setOpenEditForm] = useState(false)
    const {data: artist, isLoading, isIdle, isError, error} = useGetArtistByAccountId(accountId);

    if (isLoading || isIdle) {
        return <Loading/>
    }

    if (isError) {
        return <Error message={error.message}/>
    }

    const Render = () => {
        return (
            <div>
                <ArtistEditDialog
                    open={openEditForm}
                    onClose={() => setOpenEditForm(false)}
                    artist={artist}
                />
                <Box display="flex" justifyContent="center">
                    <Grid sx={{marginTop: "4%", width: "50vw"}} justifyContent="center">
                        <Grid item sm={12}>
                            <Typography variant='h4'>
                                {artist.firstname}{' '}{artist.lastname}{' '}
                                <Button onClick={() => setOpenEditForm(true)}>Edit</Button>
                            </Typography>
                            <Divider/>
                            <Stack spacing={2} sx={{marginTop: 4}}>
                                <Grid container>
                                    <Grid item sm={4}><strong>Email</strong></Grid>
                                    <Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item sm={4}><strong>Address</strong></Grid>
                                    <Grid item sm={8}>
                                        {artist.address ? artist.address.fullName : "empty"}
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item sm={4}><strong>Description</strong></Grid>
                                    <Grid item sm={8}>
                                        {artist.description ? artist.description : "empty"}
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        )
    }

    return (
        <div><Render/></div>
    );
};

export default ArtistInfo;
