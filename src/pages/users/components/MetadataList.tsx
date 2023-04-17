import React, {useMemo} from 'react';
import {TextField} from "@mui/material";
import {MetadataEnum} from "../../../entities/enums/MetadataEnum";
import {AccountEnum} from "../../../entities/enums/AccountEnum";
import {Account} from "../../../entities/account";
import {isCreatorOrAdmin} from "../../../util/MetadataUtil";
import {useGetOrganizationById} from "../../../api/OrganizationApi";
import {useGetFacilityById} from "../../../api/FacilityApi";
import {useGetCityById} from "../../../api/CityApi";
import {Organization} from "../../../entities/organization";
import {Facility} from "../../../entities/facility";
import {City} from "../../../entities/city";
import {AccountRole} from "./AccountRole";
import CityDropdown from "../../../components/cities/CityDropdown";
import {OrganizationsDropdown} from "../../../components/form/OrganizationsDropdown";
import {FacilitiesDropdown} from "../../../components/form/FacilitiesDropdown";
import {OrganizationRoleDropdown} from "../../../components/form/OrganizationRoleDropdown";
import {Metadata} from "../../../entities/metadata";

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

function prepareRenders(account:Account, metadata:Record<string, string>, onChange:(k:string, v?:string) => void, org?:Organization, facility?:Facility, city?:City):PartialRecord<MetadataEnum, {label: () => JSX.Element|string, view: (s:string) => JSX.Element, edit: (s:string) => JSX.Element}>  {
    return {
        [MetadataEnum.CITY_ID]: {
            label: () => "City",
            view: () => <span>{city?.name}</span>,
            edit: (v) => <CityDropdown value={v} onChange={s => onChange(MetadataEnum.CITY_ID, s)} />
        },
        [MetadataEnum.ORGANIZATION_ID]: {
            label: () => "Organization",
            view: () => <span>{org?.name}</span>,
            edit: (v) => <OrganizationsDropdown value={v} onChange={s => onChange(MetadataEnum.ORGANIZATION_ID, s)} />
        },
        [MetadataEnum.FACILITY_ID]: {
            label: () => "Facility",
            view: () => <span>{facility?.name}</span>,
            edit: (v) => <FacilitiesDropdown value={v} onChange={s => onChange(MetadataEnum.FACILITY_ID, s)} />
        },
        [MetadataEnum.ORGANIZATION_ROLE]: {
            label: () => "Organization Role",
            view: () => <AccountRole account={account}/>,
            edit: (v) => <OrganizationRoleDropdown value={v} onChange={s => onChange(MetadataEnum.ORGANIZATION_ROLE, s)}/>
        },
        [MetadataEnum.DESCRIPTION]: {
            label: () => "Profile Description",
            view: () => <div>{metadata[MetadataEnum.DESCRIPTION]}</div>,
            edit: (v) => <TextField fullWidth multiline minRows={5} type={"textarea"} value={v} onChange={e => onChange(MetadataEnum.DESCRIPTION, e.target.value)}/>
        },
    }
}
const MetadataList = (props: {account:Account, metadata:Metadata[], canEdit:boolean, onChange:(k:string,v?:string) => void }) => {
    const metadata = useMemo(() => props.metadata.reduce((map, element) => {
        map[element.key] = element.value;
        return map
    }, {} as Record<string, string>), [props.metadata]);

    const properties:MetadataEnum[] = useMemo(() => prepareAccountProperties(props.account), [props.account]);
    const {data: org} = useGetOrganizationById(metadata[MetadataEnum.ORGANIZATION_ID]);
    const {data: facility} = useGetFacilityById(metadata[MetadataEnum.FACILITY_ID]);
    const {data: city} = useGetCityById(metadata[MetadataEnum.CITY_ID]);

    const renders = useMemo(() => prepareRenders(props.account, metadata, props.onChange, org, facility, city), [props.account, metadata, org, facility, city]);


    return (
        <>
            {properties.map(key => {
                const render = renders[key];
                if(!render) {
                    return null;
                }
                const value = metadata[key];
                return <tr key={key}>
                    <td>
                        <strong>{render.label()}</strong>
                    </td>
                    <td>{props.canEdit ? render.edit(value) : render.view(value)}</td>
                </tr>
            })}
        </>
    );
};

export function prepareAccountProperties(account: Account) {
    switch (account.accountType) {
        case AccountEnum.SYSTEM:
            return [MetadataEnum.DESCRIPTION]
        case AccountEnum.ARTIST:
            return [MetadataEnum.CITY_ID, MetadataEnum.DESCRIPTION]
        case AccountEnum.REPRESENTATIVE:
            const isAdmin = isCreatorOrAdmin(account);
            return [
                MetadataEnum.CITY_ID,
                MetadataEnum.ORGANIZATION_ID,
                MetadataEnum.ORGANIZATION_ROLE,
                isAdmin ? undefined : MetadataEnum.FACILITY_ID,
                MetadataEnum.DESCRIPTION
            ].filter(s => s) as MetadataEnum[];
        default:
            return []
    }
}

export default MetadataList;
