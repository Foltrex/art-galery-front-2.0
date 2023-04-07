import { Autocomplete, AutocompleteRenderInputParams, Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Skeleton, TextField, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import RepresentativeForm from './RepresentativeForm';
import UserTable from './UserTable';
import SearchBar from '../../components/ui/SearchBar';
import { useGetAllCities } from '../../api/CityApi';
import CityDropdown from '../../components/cities/CityDropdown';
import { City } from '../../entities/city';
import { Search } from '@mui/icons-material';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { TokenService } from '../../services/TokenService';


const UserRoute = () => {
	const [city, setCity] = useState<City>();

	const handleCityChange = (e: SelectChangeEvent<string>) => {
		const currentCity = cities?.find(city => city.id === e.target.value);
		setCity(currentCity);
	}
    
	const { data: cities, isSuccess: isSuccessCities } = useGetAllCities();

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

                <Box sx={{display: 'flex', alignItems: 'center', my: 2, justifyContent: 'space-around'}}>
                    <FormControl sx={{flex: '15%', mx: 1}} size='small'>
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
                        onSearch={() => { }} placeholder={'Enter lastname/firstname...'}
                    />

                    <Autocomplete 
                        size='small'
                        sx={{flex: '30%', mx: 1 }}
                        freeSolo
                        renderInput={(params) => {
                            return (
                                <TextField {...params} 
                                    label="Organizaitons"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton>
                                                    <Search />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            );
                        }}
                        options={[]} />
                </Box>

                <UserTable />
            </Paper>
        </div>
    );
};

export default UserRoute;
