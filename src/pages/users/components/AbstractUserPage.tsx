import {Grid} from "@mui/material";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import React from "react";
import {Account} from "../../../entities/account";

export const AbstractUserPage = ({account, onSubmit, back}:{account:Account, onSubmit:(a:Account) => Promise<boolean>, back?:() => void}) => {
    return <Grid>
        <Grid sx={{mt: 6}}>
            <ProfileImage account={account}/>
        </Grid>
        <Grid sx={{textAlign: 'center', mt: 4, mx: 'auto'}}>
            <ProfileInfo account={account} onSubmit={onSubmit} back={back}/>
        </Grid>
    </Grid>
}