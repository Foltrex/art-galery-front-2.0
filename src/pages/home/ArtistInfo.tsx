import React, {useState} from 'react';
import {Artist} from "../../entities/artist";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {AuthService} from "../../services/AuthService";
import Box from "@mui/material/Box";
import OrganizationEditDialog from "./edit/OrganizationEditDialog";
import ArtistEditDialog from "./edit/ArtistEditDialog";
import {TokenService} from "../../services/TokenService";

const ArtistInfo = (props: { artist: Artist }) => {
    const artist = props.artist;
    const [openEditForm, setOpenEditForm] = useState(false)

    return (
        <div>
            <ArtistEditDialog
                open={openEditForm}
                onClose={() => setOpenEditForm(false)}
                artist={artist}
            />
            <Box display="flex" justifyContent="center">
                <Grid
                    sx={{marginTop: "4%", width: "50vw"}}
                    justifyContent="center"
                >
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
                                <Grid item sm={4}><strong>Description</strong></Grid>
                                <Grid item sm={8}>
                                    {artist.description ? artist.description : "empty"}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item sm={4}><strong>Address</strong></Grid>
                                <Grid item sm={8}>
                                    {artist.address ? artist.address.fullName : "empty"}
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default ArtistInfo;
