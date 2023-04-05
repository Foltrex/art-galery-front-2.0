import {OutlinedInput} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddressList from "./AddressList";
import { useSearch } from "../../api/OpenStreetMapApi";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

export interface GeoPosition {
    place_id: number,
    display_name: string,
    lat: number,
    lon: number,
    address: {
        city: string,
    }
}

export default function SearchBox(props: { selectPosition: any; setSelectPosition: any; }) {
    const {setSelectPosition} = props;
    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState<GeoPosition[]>([]);
    const {alertStore} = useRootStore();

    const { data } = useSearch(searchText);

    useEffect(() => {
        const delayFetch = setTimeout(() => setListPlace(data ?? []), 1000)

        return () => clearTimeout(delayFetch)
    }, [searchText, data])

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <OutlinedInput
                        style={{width: "100%"}}
                        value={searchText}
                        placeholder={"Type anything for search..."}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                        }}
                    />
                </div>
            </div>
            <div>
                <AddressList listPlace={listPlace} setSelectPosition={setSelectPosition}/>
            </div>
        </div>
    );
}
