import {FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import * as React from 'react';
import {useGetAllCities} from "../../api/CityApi";

interface ICityDropdownProps {
    value?: string;
    onChange: (cityId:string) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const CityDropdown: React.FunctionComponent<ICityDropdownProps> = ({

    value,
    onChange ,
    disabled = false
}) => {

    const { data: cities } = useGetAllCities();

    return (
        <FormControl size='small' >
            <InputLabel id='city-dropdown'>Cities</InputLabel>
            <Select
                disabled={disabled}
                labelId='city-dropdown'
                value={value ?? ''}
                label='Cities'
                onChange={(e, a) => onChange(e.target.value)}
            >
                <MenuItem value=''>All Cities</MenuItem>
                {cities && cities.map(city => (
                    <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CityDropdown;