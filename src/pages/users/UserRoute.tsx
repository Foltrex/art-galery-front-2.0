import { Search } from '@mui/icons-material';
import { Autocomplete, Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Skeleton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useGetAll } from '../../api/AccountApi';
import { useGetAllCities } from '../../api/CityApi';
import CityDropdown from '../../components/cities/CityDropdown';
import SearchBar from '../../components/ui/SearchBar';
import { City } from '../../entities/city';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { TokenService } from '../../services/TokenService';
import UserTable from './UserTable';
import { useGetAllOrganizationList } from '../../api/OrganizationApi';


const UserRoute = () => {
    const [city, setCity] = useState<City>();

    const handleCityChange = (e: SelectChangeEvent<string>) => {
        const currentCity = cities?.find(city => city.id === e.target.value);
        setCity(currentCity);
    }

    const { data: cities, isSuccess: isSuccessCities } = useGetAllCities();

    const { data: organizations } = useGetAllOrganizationList();

    const renderCityDropdown = () => {
        if (isSuccessCities && cities?.length !== 0) {
            return (
                <CityDropdown
                    style={{ flex: '15%' }}
                    value={city?.id}
                    cities={cities}
                    onChange={handleCityChange} />
            );
        } else if (isSuccessCities && (!cities || cities.length === 0)) {
            return (
                <CityDropdown style={{ flex: '15%' }} disabled />
            );
        } else {
            return (
                <Skeleton sx={{ flex: '15%' }} />
            );
        }
    }

    const loggedUserAccountType = TokenService.getCurrentAccountType();
    const userTypes = Object
        .keys(AccountEnum)
        .filter(type => loggedUserAccountType === AccountEnum.SYSTEM || type !== AccountEnum.SYSTEM);
    const [userType, setUserType] = useState<string>();

    const handleUsertypeChange = (e: SelectChangeEvent<string>) => {
        const currentUserType = userTypes.find(type => type === e.target.value);
        setUserType(currentUserType);
    }

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);
    const [organizationName, setOrganizationName] = useState<string>();

    const [username, setUsername] = useState<string>();

    const { data } = useGetAll({ page: pageNumber, size: rowsPerPage, username: username, usertype: userType, 'city-id': city?.id, organization: organizationName });

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

                    {renderCityDropdown()}

                    <SearchBar
                        style={{ flex: '30%', marginLeft: 1, marginRight: 1 }}
                        onSearch={(text) => setUsername(text)}
                        placeholder={'Enter lastname/firstname...'}
                    />

                    {organizations &&
                        <Autocomplete
                            id='free-soloe'
                            size='small'
                            sx={{ flex: '30%', mx: 1 }}
                            freeSolo
                            renderInput={(params) => <TextField {...params} label="Organizaitons" />}
                            options={organizations.map(o => o.name)}
                            onInputChange={(event, value) => {
                                if (event?.type === "change") {
                                    setOrganizationName(value);
                                }
                            }} 
                        />
                    }
                </Box>

                {data &&
                    <UserTable
                        data={data}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={setRowsPerPage}
                        onPageNumberChange={setPageNumber}
                    />
                }
            </Paper>
        </div>
    );
};

export default UserRoute;