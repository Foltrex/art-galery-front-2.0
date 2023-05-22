import {Autocomplete, TextField} from "@mui/material";
import {useMemo} from "react";
import {OrganizationRoleEnum, roleToString} from "../../entities/enums/organizationRoleEnum";

export const options = [
    {id: OrganizationRoleEnum.CREATOR, label: roleToString(OrganizationRoleEnum.CREATOR)},
    {id: OrganizationRoleEnum.MODERATOR, label: roleToString(OrganizationRoleEnum.MODERATOR)},
    {id: OrganizationRoleEnum.MEMBER, label: roleToString(OrganizationRoleEnum.MEMBER)},
]

export const OrganizationRoleDropdown = ({onChange, error, value}:{value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const optValue = useMemo(() => {
        if(!value || !options) {
            return undefined;
        }
        for(let i = 0; i < options.length; i++) {
            if(options[i].id === value) {
                return options[i];
            }
        }
    }, [value]);

    return <Autocomplete
            size='small'
            value={optValue}
            renderInput={(params) => <TextField {...params} error={!!error} helperText={error} />}
            options={options}
            onChange={(event, option) => {
                onChange(option?.id)
            }}
        />
}