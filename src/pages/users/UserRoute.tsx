import {Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography} from '@mui/material';
import {useState} from 'react';
import {useGetAll} from '../../api/AccountApi';
import CityDropdown from '../../components/cities/CityDropdown';
import SearchBar from '../../components/ui/SearchBar';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import {TokenService} from '../../services/TokenService';
import UserTable from './UserTable';
import {OrganizationsFilter} from "../../components/form/OrganizationsFilter";


const UserRoute = () => {
    const [cityId, setCityId] = useState<string>();

    const handleCityChange = (e: string) => {
        setCityId(e);
    }



    const loggedUserAccountType = TokenService.getCurrentAccountType();
    const userTypes = Object
        .keys(AccountEnum)
        .filter(type => loggedUserAccountType === AccountEnum.SYSTEM || type !== AccountEnum.SYSTEM);
    const [userType, setUserType] = useState<string>('');

    const handleUsertypeChange = (e: SelectChangeEvent<string>) => {
        const currentUserType = userTypes.find(type => type === e.target.value);
        setUserType(currentUserType || '');
    }
    const [organizationId, setOrganizationId] = useState<string>();

    const [username, setUsername] = useState<string>()

    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4' align='left'>
                    <b>Representatives</b>
                </Typography>
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '1%' }}>

                <Box sx={{ display: 'flex', alignItems: 'center', my: 2, justifyContent: 'space-around' }}>
                    <FormControl sx={{ flex: '15%', mx: 1 }} size='small'>
                        <InputLabel id='usertype-dropdown'>Usertype</InputLabel>
                        <Select
                            labelId='usertype-dropdown'
                            label='Usertype'
                            value={userType}
                            onChange={handleUsertypeChange}
                        >
                            <MenuItem value=''>All</MenuItem>
                            {userTypes.map(type => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <CityDropdown value={cityId} onChange={handleCityChange} />

                    <SearchBar
                        style={{ flex: '30%', marginLeft: 1, marginRight: 1 }}
                        onSearch={(text) => setUsername(text)}
                        placeholder={'Enter lastname/firstname...'}
                    />

                    <OrganizationsFilter setOrganizationId={setOrganizationId} />
                </Box>

                <UserTable cityId={cityId} username={username} usertype={userType} organizationId={organizationId} />
            </Paper>
        </div>
    );
};

export default UserRoute;
