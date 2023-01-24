import React from 'react';
import {Grid} from "@mui/material";
import {Link} from "react-router-dom";

const LoginFormBottom = () => {
    return (
        <div>
            <Grid container>
                <Grid item xs>
                    <Link className={"my-link"} to={"/auth/passwordrecovery"}>
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link className={"my-link"} to={"/auth/signup"}>
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}

export default LoginFormBottom;