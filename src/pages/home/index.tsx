import React from 'react';
import {Box} from "@mui/material";
import {Container} from "@mui/system";
import ProfileImage from "./ProfileImage";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import Loading from "../../components/ui/Loading";
import ProfileInfo from "./ProfileInfo";
import {observer} from "mobx-react-lite";


const ProfilePage = observer(() => {

    const {authStore} = useRootStore();
    const account = authStore.account;

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
