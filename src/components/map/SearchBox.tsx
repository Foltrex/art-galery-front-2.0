import React, {useEffect, useState} from "react";
import AddressList from "./AddressList";
import {useSearch} from "../../api/OpenStreetMapApi";
import {TypeFilter} from "../form/TypeFilter";

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

    const {data, isLoading, isFetching} = useSearch(searchText);

    useEffect(() => {
        setListPlace((data ?? []).filter(item => {
            return item.address?.city
        }))
    }, [data])

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", justifyItems: "center"}}>
                <TypeFilter style={{flex: 1}} onChange={setSearchText} placeholder={"Type anything for search..."}/>
            </div>
            <div>
                <AddressList
                    listPlace={listPlace}
                    setSelectPosition={setSelectPosition}
                    isLoading={isLoading && isFetching}
                />
            </div>
        </div>
    );
}
