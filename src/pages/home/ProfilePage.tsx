import React from 'react';
import {Box, Divider, Grid, Typography} from "@mui/material";
import {Container} from "@mui/system";
import ProfileImage from "./ProfileImage";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {TokenService} from "../../services/TokenService";
import {useGetAccountById} from "../../api/AccountApi";
import Loading from "../../components/ui/Loading";
import Error from "../../components/ui/Error";
import ProfileInfo from "./ProfileInfo";
import {observer} from "mobx-react-lite";

// const AlertNotification: React.FC<IRepresentativeTableItemProps> = observer((props) => {

const ProfilePage = observer(() => {

    //@Todo what is it? it's not working now
    const {authStore} = useRootStore();
    const account = authStore.account;

    // const accountId = TokenService.getCurrentAccountId();
    // const {data: account, isLoading, isIdle, isError, error} = useGetAccountById(accountId);
    //
    // if (isLoading || isIdle) {
    //     return <Loading/>
    // }
    //
    // if (isError) {
    //     return <Error message={error.message}/>
    // }

    if (account === undefined) {
        return <Loading/>
    }

    return (
        <Container>
            <Box sx={{mt: 6}}>
                <ProfileImage account={account}/>
            </Box>
            <Box sx={{textAlign: 'center', width: '40%', mt: 4, mx: 'auto'}}>
                <ProfileInfo account={account}/>
            </Box>
        </Container>
    );
});

export default ProfilePage;
