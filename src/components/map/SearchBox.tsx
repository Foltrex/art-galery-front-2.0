import {OutlinedInput} from "@mui/material";
import React, {useState} from "react";
import AddressList from "./AddressList";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export interface Item {
    place_id: number,
    display_name: string
}

export default function SearchBox(props: { selectPosition: any; setSelectPosition: any; }) {
    const {selectPosition, setSelectPosition} = props;
    const [searchText, setSearchText] = useState("");
    const [listPlace, setListPlace] = useState<Item[]>([]);

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex"}}>
                <div style={{flex: 1}}>
                    <OutlinedInput
                        style={{width: "100%"}}
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(event.target.value);
                            const params = {
                                q: event.target.value,
                                format: "json",
                                addressdetails: "1",
                                polygon_geojson: "0",
                            };

                            const queryString = new URLSearchParams(params).toString();

                            fetch(`${NOMINATIM_BASE_URL}${queryString}`)
                                .then((response) => response.text())
                                .then((result) => {
                                    console.log(JSON.parse(result));
                                    setListPlace(JSON.parse(result));
                                })
                                .catch((err) => console.log("err: ", err));
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
