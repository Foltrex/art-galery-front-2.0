import {Autocomplete, TextField} from "@mui/material";
import {useMemo} from "react";
import {useGetAllFacilities} from "../../api/FacilityApi";
import {Facility} from "../../entities/facility";

export const FacilitiesDropdown = ({onChange, error, value}:{value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const { data: organizations } = useGetAllFacilities(0, 9999, 'name,asc');

    const organizationOptions = useMemo(() => {
        if(!organizations) {
            return [];
        }
        function buildLabel(o:Facility) {
            if(map[o.name] === 1) {
                return o.name || '';
            } else {
                return o.name + " [" + o.id + "]";
            }
        }
        const map:Record<string, number> = {};
        organizations.content.forEach(org => {
            if(map[org.name] === undefined) {
                map[org.name] = 1
            } else {
                map[org.name]++;
            }
        })
        return organizations.content.map(o => ({label: buildLabel(o), id: o.id}));
    }, [organizations]);

    const optValue = useMemo(() => {
        if(!value || !organizationOptions) {
            return undefined;
        }
        for(let i = 0; i < organizationOptions.length; i++) {
            if(organizationOptions[i].id === value) {
                return organizationOptions[i];
            }
        }
    }, [value, organizationOptions]);

    return <Autocomplete
            size='small'
            value={optValue}
            renderInput={(params) => <TextField {...params} error={!!error} helperText={error} />}
            options={organizationOptions}
            onChange={(event, option) => {
                onChange(option?.id)
            }}
        />
}