import {Grid} from "@mui/material";
import {Link} from "react-router-dom";

const RegisterFormBottom = () => {
    return (
        <div>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link to={"/auth/signin"}>
                        Already have an account? Sign in
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
};

export default RegisterFormBottom;
