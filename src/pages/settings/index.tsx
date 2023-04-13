import React, {useState} from 'react';
import Box from "@mui/material/Box";
import {Button, Divider, Grid, Typography} from "@mui/material";
import {Stack} from "@mui/system";
import {useDeleteAccountById} from "../../api/AccountApi";
import {TokenService} from "../../services/TokenService";
import {useNavigate} from "react-router-dom";
import ChangePasswordDialog from "./dialog/ChangePasswordDialog";
import DeleteModal from "../../components/modal/DeleteModal";
import Bubble from "../../components/bubble/Bubble";
import {getErrorMessage} from "../../util/PrepareDataUtil";

const Settings = () => {
    const navigate = useNavigate();
    const deleteMutation = useDeleteAccountById();

    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)
    const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false)

    const onDelete = () => {
        deleteMutation.mutateAsync(TokenService.getCurrentAccountId())
            .then(() => {
                Bubble.success("Your deleted. Bye-bye!");
                navigate('/auth/signin');
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                Bubble.error({message: "Failed to delete your account. Error message is: " + getErrorMessage(error), duration: 999999});
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
