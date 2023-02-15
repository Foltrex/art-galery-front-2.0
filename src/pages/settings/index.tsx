import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {useDeleteAccountById} from "../../api/AccountApi";
import {TokenService} from "../../services/TokenService";
import {useNavigate} from "react-router-dom";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import ChangePasswordDialog from "./dialog/ChangePasswordDialog";
import DeleteModal from "../../components/modal/DeleteModal";

const Settings = () => {
    const navigate = useNavigate();
    const deleteMutation = useDeleteAccountById();
    const {alertStore} = useRootStore();

    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false)

    const onDelete = () => {
        deleteMutation.mutateAsync(TokenService.getCurrentAccountId())
            .then(() => {
                alertStore.setShow(
                    true,
                    "success",
                    " ",
                    "Your account is successfully deleted"
                );

                navigate('/auth/signin');
            })
            .catch(error => {
                console.log(error.response.data.message)
            })
    }

    return (
        <div>
            <ChangePasswordDialog
                open={openChangePasswordDialog}
                onClose={() => setOpenChangePasswordDialog(false)}
            />
            <DeleteModal
                open={openDeleteAccountDialog}
                onClose={() => setOpenDeleteAccountDialog(false)}
                onDelete={onDelete}
                contextText={"Do you really want to delete your account?"}
            />
            <Box display="flex" justifyContent="center">
                <Grid sx={{marginTop: "4%", width: "50vw"}} justifyContent="center">
                    <Grid item sm={12}>
                        <Typography variant='h6'>
                            Account settings
                        </Typography>
                        <Divider/>
                        <Grid container sx={{marginTop: 3}}>
                            <Grid item sm={4}>
                                <Stack spacing={1}>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => setOpenChangePasswordDialog(true)}
                                    >
                                        Change password
                                    </Button>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => setOpenDeleteAccountDialog(true)}
                                    >
                                        Delete account
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Settings;
