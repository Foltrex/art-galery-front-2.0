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

import {useRootStore} from "../../../stores/provider/RootStoreProvider";
import {FormikProps} from "formik";
import {getErrorMessage} from "../../../components/error/ResponseError";

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

function findError(props: MetadataListProps, key: MetadataEnum) {
    const keys = prepareAccountProperties(props.formik.values);
    const index = keys.indexOf(key);
    const meta = props.formik.errors?.metadata;
    const obj = meta ? meta[index] : undefined;
    //@ts-ignore
    return obj ? obj.value : undefined;
}

function prepareRenders(props:MetadataListProps, metadata:Record<string, string>, org?:Organization, facility?:Facility, city?:City):PartialRecord<MetadataEnum, MetadataRender>  {
    return {
        [MetadataEnum.CITY_ID]: {
            label: () => "City",
            view: () => <span>{city?.name}</span>,
            edit: (v) => <CityDropdown value={v} onChange={s => props.onChange(MetadataEnum.CITY_ID, s)} />
        },
        [MetadataEnum.ORGANIZATION_ID]: {
            label: () => "Organization",
            view: () => <span>{org?.name}</span>,
            edit: (v) => <OrganizationsDropdown value={v} error={findError(props, MetadataEnum.ORGANIZATION_ID)} onChange={s => props.onChange(MetadataEnum.ORGANIZATION_ID, s)} />
        },
        [MetadataEnum.FACILITY_ID]: {
            label: () => "Facility",
            view: () => <span>{facility?.name}</span>,
            edit: (v) => <FacilitiesDropdown value={v} error={findError(props, MetadataEnum.FACILITY_ID)} organizationId={props.organizationId} onChange={s => props.onChange(MetadataEnum.FACILITY_ID, s)} />
        },
        [MetadataEnum.ORGANIZATION_ROLE]: {
            label: () => "Role",
            view: () => <AccountRole account={props.formik.values}/>,
            edit: (v) => <OrganizationRoleDropdown value={v} onChange={s => props.onChange(MetadataEnum.ORGANIZATION_ROLE, s)}/>
        },
        [MetadataEnum.DESCRIPTION]: {
            label: () => <span>About</span>,
            view: () => <div>{metadata[MetadataEnum.DESCRIPTION]}</div>,
            edit: (v) => <TextField fullWidth multiline minRows={5} type={"textarea"} value={v} onChange={e => props.onChange(MetadataEnum.DESCRIPTION, e.target.value)}/>
        },
    }
}

interface MetadataListProps {
    formik: FormikProps<Account>
    organizationId?:string,
    canEdit:boolean,
    onChange:(k:string,v?:string) => void
}
interface MetadataRender {
    label: () => (JSX.Element | string);
    view: (s: string) => JSX.Element;
    edit: (s: string) => JSX.Element
}

const MetadataList = (props: MetadataListProps) => {
    const currentUser = useRootStore().authStore.account;
    const account = props.formik.values
    const metadata = useMemo(() => account.metadata?.reduce((map, element) => {
        map[element.key] = element.value;
        return map
    }, {} as Record<string, string>) || {}, [account.metadata]);

    const properties:MetadataEnum[] = useMemo(() => prepareAccountProperties(account), [account]);
    const {data: org} = useGetOrganizationById(
        metadata[MetadataEnum.ORGANIZATION_ID],
        (e) => getErrorMessage("Failed to load organization data", e)
    );
    const {data: facility} = useGetFacilityById(metadata[MetadataEnum.FACILITY_ID], (e) => {
        getErrorMessage("Failed to load facility information", e)
    });
    const {data: city} = useGetCityById(metadata[MetadataEnum.CITY_ID], (e) => {
        getErrorMessage("Failed to load city information", e)
    });

    const renders = useMemo(() => prepareRenders(props, metadata, org, facility, city), [props, metadata, org, facility, city]);

    return (
        <>
            {properties.map(key => {
                const render = renders[key];
                if(!render) {
                    return null;
                }
                let content = defineContent(currentUser, props, render, key, metadata[key]);

                return <tr key={key}>
                    <td className={"label"}>{render.label()}</td>
                    <td>{content}</td>
                </tr>
            })}
        </>
    );
};

function defineContent(currentUser: Account, props: MetadataListProps, render: MetadataRender, key: MetadataEnum, value:string) {
    switch (key) {
        case MetadataEnum.ORGANIZATION_ID:
            if (currentUser.accountType === AccountEnum.SYSTEM) {
                return render.edit(value)
            } else {
                return render.view(value);
            }
        default:
            return props.canEdit ? render.edit(value) : render.view(value)
    }
}

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
