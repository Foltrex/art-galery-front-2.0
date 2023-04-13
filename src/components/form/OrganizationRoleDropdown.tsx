import {Autocomplete, TextField} from "@mui/material";
import {useMemo} from "react";
import {OrganizationRoleEnum} from "../../entities/enums/organizationRoleEnum";

export const OrganizationRoleDropdown = ({onChange, error, value}:{value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const organizationOptions = useMemo(() => {
        return [
            {id: OrganizationRoleEnum.CREATOR, label: "Owner"},
            {id: OrganizationRoleEnum.MODERATOR, label: "Organization Admin"},
            {id: OrganizationRoleEnum.MEMBER, label: "Facility Admin"},
        ]
    }, []);

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
            renderInput={(params) => <TextField {...params} label="Organization role" error={!!error} helperText={error} />}
            options={organizationOptions}
            onChange={(event, option) => {
                onChange(option?.id)
            }}
        />
}