import * as React from 'react';
import {useState} from 'react';
import GenericAutocomplete from "./GenericAutocomplete";
import {useGetAll} from "../../api/AccountApi";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {IPage} from "../../hooks/react-query";
import {Account} from "../../entities/account";

export default function UsersAutocomplete({userType, onChange}:{
    userType?:AccountEnum,
    onChange:(userId?:string) => void
}) {
    const [name, setName] = useState("");
    const users = useGetAll({page: 0, size: 999999, usertype: userType, name: name}, {retry: false, enabled: !!name});

    return <GenericAutocomplete<Account, IPage<Account>>
        reactAt={2}
        mapFunction={r => r.content}
        queryResult={users}
        onChange={(v) => onChange(v ? v.id : undefined)}
        label={"Users"}
        noOptionsText={"Nothing found"}
        renderOption={(option) => {return (option.firstName ? option.firstName + " " : "") + (option.lastName || "")}}
        searchChanged={(name) => setName(name)}/>

}