import {Autocomplete, TextField} from "@mui/material";
import {useMemo} from "react";
import {useGetAllFacilities} from "../../api/FacilityApi";
import {Facility} from "../../entities/facility";
import {getErrorMessage} from "../error/ResponseError";


export const FacilitiesDropdown = ({onChange, error, value, organizationId}:{organizationId?:string, value?:string, error?:any, onChange: (id:string|undefined) => void}) => {

    const { data: facilities } = useGetAllFacilities({page: 0, size: 9999,  sort: 'name,asc'}, (error) => {
        getErrorMessage("Failed to load data for facilities dropdown. Error message is: ", error)
    });

    const organizationOptions = useMemo(() => {
        if(!facilities) {
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
        const data = organizationId
            ? facilities.content.filter(f => f.organizationId === organizationId)
            : facilities.content;
        data.forEach(org => {
            if(map[org.name] === undefined) {
                map[org.name] = 1
            } else {
                map[org.name]++;
            }
        })
        return data.map(o => ({label: buildLabel(o), id: o.id}));
    }, [facilities, organizationId]);

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