import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import * as React from 'react';
import { City } from '../../entities/city';
import { ArrowDropDown } from '@mui/icons-material';

interface ICityDropdownProps {
    value?: string;
    cities?: City[];
    onChange?: (e: SelectChangeEvent<string>) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const CityDropdown: React.FunctionComponent<ICityDropdownProps> = ({

    value,
    cities = [],
    onChange = (e: SelectChangeEvent<string>) => { },
    disabled = false,
    style
}) => {
    if (!disabled) {
        return (
            <FormControl size='small' sx={{ flex: '20%' }} style={{...style}} >
                <InputLabel id='city-dropdown'>Cities</InputLabel>
                <Select
                    labelId='city-dropdown'
                    value={value ?? ''}
                    label='Cities'
                    onChange={onChange}
                >
                    <MenuItem value=''>All Cities</MenuItem>
                    {cities.map(city => (
                        <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    } else {
        return (
            <FormControl size='small' sx={{ flex: '20%' }} variant='outlined'>
                <InputLabel htmlFor='city-dropdown'>Cities</InputLabel>
                <OutlinedInput
                    id='city-dropdown'
                    label='Cities'
                    disabled
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton disableRipple disableTouchRipple size='small'>
                                <ArrowDropDown />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        );
    }
};

export default CityDropdown;