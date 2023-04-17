import {Autocomplete, TextField} from "@mui/material";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";
import {useMemo} from "react";
import {Organization} from "../../entities/organization";

export const OrganizationsDropdown = ({onChange, error, value}:{value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const { data: organizations } = useGetAllOrganizationList();

    const organizationOptions = useMemo(() => {
        if(!organizations) {
            return [];
        }
        function buildLabel(o:Organization) {
            if(map[o.name] === 1) {
                return o.name || '';
            } else {
                return o.name + " [" + o.id + "]";
            }
        }
        const map:Record<string, number> = {};
        organizations.forEach(org => {
            if(map[org.name] === undefined) {
                map[org.name] = 1
            } else {
                map[org.name]++;
            }
        })
        return organizations.map(o => ({label: buildLabel(o), id: o.id}));
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