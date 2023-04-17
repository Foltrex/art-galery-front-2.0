import {Autocomplete, TextField} from "@mui/material";
import {useMemo} from "react";
import {AccountEnum} from "../../entities/enums/AccountEnum";

export const UserTypeDropdown = ({onChange, error, value}:{value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const organizationOptions = useMemo(() => {
        return [
            {id: AccountEnum.SYSTEM, label: "System user"},
            {id: AccountEnum.REPRESENTATIVE, label: "Organization representative"},
            {id: AccountEnum.ARTIST, label: "Artist"},
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
            renderInput={(params) => <TextField {...params} error={!!error} helperText={error} />}
            options={organizationOptions}
            onChange={(event, option) => {
                onChange(option?.id)
            }}
        />
}