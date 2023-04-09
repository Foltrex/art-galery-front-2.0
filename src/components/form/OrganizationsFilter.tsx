import {Autocomplete, TextField} from "@mui/material";
import {useGetAllOrganizationList} from "../../api/OrganizationApi";
import {useMemo} from "react";
import {Organization} from "../../entities/organization";

export const OrganizationsFilter = ({setOrganizationId}:{setOrganizationId: (id:string|undefined) => void}) => {

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