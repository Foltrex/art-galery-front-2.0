import {Autocomplete, TextField} from '@mui/material';
import * as React from 'react';
import {useMemo} from 'react';
import {useGetAllCities} from "../../api/CityApi";
import {City} from "../../entities/city";

interface ICityDropdownProps {
    value?: string;
    error?: string;
    onChange: (cityId?:string) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

const CityDropdown: React.FunctionComponent<ICityDropdownProps> = ({

    value,
    onChange ,
    error ,
    disabled = false
}) => {

    const { data: cities } = useGetAllCities();
    const cityOptions = useMemo(() => {
        if(!cities) {
            return [];
        }
        function buildLabel(o:City) {
            if(map[o.name] === 1) {
                return o.name || '';
            } else {
                return o.name + " [" + o.id + "]";
            }
        }
        const map:Record<string, number> = {};
        cities.forEach(org => {
            if(map[org.name] === undefined) {
                map[org.name] = 1
            } else {
                map[org.name]++;
            }
        })
        return cities.map(o => ({label: buildLabel(o), id: o.id}));
    }, [cities]);

    const optValue = useMemo(() => {
        if(!value || !cityOptions) {
            return undefined;
        }
        for(let i = 0; i < cityOptions.length; i++) {
            if(cityOptions[i].id === value) {
                return cityOptions[i];
            }
        }
    }, [value, cityOptions]);

    return (
        <Autocomplete
            size='small'
            value={optValue}
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    error={!!error} 
                    helperText={error} 
                />
            )}
            options={cityOptions}
            onChange={(event, option) => {
                onChange(option?.id)
            }}
        />
    );
};

export default CityDropdown;