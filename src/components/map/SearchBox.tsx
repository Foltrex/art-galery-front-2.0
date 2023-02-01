import {OutlinedInput} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddressList from "./AddressList";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

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
    const {selectPosition, setSelectPosition} = props;
    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState<GeoPosition[]>([]);


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Send Axios request here
            console.log(searchText)
            const params = {
                q: searchText,
                format: "json",
                addressdetails: "1",
                polygon_geojson: "0",
            };

            const queryString = new URLSearchParams(params).toString();

            fetch(`${NOMINATIM_BASE_URL}${queryString}`)
                .then((response) => response.text())
                .then((result) => {
                    const json = JSON.parse(result);
                    console.log(json);
                    if (!json.error) {
                        setListPlace(json);
                    }
                })
                .catch((err) => {
                    console.log("err: ", err)
                    setListPlace([])
                });
        }, 1000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchText])

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
