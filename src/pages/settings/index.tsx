import React from 'react';
import Box from "@mui/material/Box";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {useDeleteAccountById} from "../../api/AccountApi";
import {TokenService} from "../../services/TokenService";
import {useNavigate} from "react-router-dom";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

const Settings = () => {

    const navigate = useNavigate();
    const deleteMutation = useDeleteAccountById();
    const {alertStore} = useRootStore();

    const deleteAccount = async () => {
        try {

            deleteMutation.mutateAsync(TokenService.getCurrentAccountId())
                .then(() => {
                    alertStore.setShow(
                        true,
                        "success",
                        "Delete account",
                        "Your account is successfully deleted"
                    );

                    navigate('/auth/signin');
                })

        } catch (error: any) {
            console.log(error.response.data.message)
        }
    }

    return (
        <div>
            <Box display="flex" justifyContent="center">
                <Grid sx={{marginTop: "4%", width: "50vw"}} justifyContent="center">
                    <Grid item sm={12}>
                        <Typography variant='h6'>
                            Account settings
                        </Typography>
                        <Divider/>
                        <Stack spacing={2} sx={{marginTop: 4}}>
                            <Grid container>
                                <Grid item sm={12}>
                                    <Button variant={"contained"}
                                            color={"error"}
                                            onClick={() => deleteAccount()}
                                    >
                                        Delete account
                                    </Button>
                                </Grid>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Settings;
