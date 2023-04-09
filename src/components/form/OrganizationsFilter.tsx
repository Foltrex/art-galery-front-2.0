import {Autocomplete, TextField} from "@mui/material";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";
import {useMemo} from "react";

export const OrganizationsFilter = ({setOrganizationId}:{setOrganizationId: (id:string|undefined) => void}) => {

    const { data: organizations } = useGetAllOrganizationList();

    const organizationOptions = useMemo(() => {
        return organizations ? organizations.map(o => ({label: o.name || '', id: o.id})) : [];
    }, [organizations]);

    return <Autocomplete
            size='small'
            sx={{ flex: '30%', mx: 1 }}
            renderInput={(params) => <TextField {...params} label="Organizaitons" />}
            options={organizationOptions}
            onChange={(event, option) => {
                setOrganizationId(option?.id)
            }}
        />
}