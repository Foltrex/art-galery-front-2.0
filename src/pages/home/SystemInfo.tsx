import {Box, Divider, Grid, Typography} from "@mui/material";
import {useGetRepresentativeByAccountId} from "../../api/RepresentativeApi";
import {TokenService} from "../../services/TokenService";
import Man from '../../assets/images/man.png';
import {Container} from "@mui/system";

const SystemInfo = () => {
    const accountId = TokenService.getCurrentAccountId();
    const { data: representative } = useGetRepresentativeByAccountId(accountId);

    return (
        <Container>
            <Box sx={{ mt: 6 }}>
                <img src={Man} style={{ maxHeight: '270px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
            </Box>
            <Box sx={{ textAlign: 'center', width: '40%', mt: 4, mx: 'auto' }}>
                <Typography variant='h4'>
                    {representative?.firstname}{' '}{representative?.lastname}{' '}
                </Typography>

                <Divider sx={{ mx: 'auto'}}/>
                
                <Grid container justifyContent='center' sx={{mt: 4}}>
                    <Grid item sm={4}><strong>Email</strong></Grid>
                    <Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default SystemInfo;
