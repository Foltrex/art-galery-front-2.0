import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Divider, ListItemIcon} from "@mui/material";
import {Item} from "./SearchBox";
import {Address} from "../../entities/address";

export default function AddressList(props: { listPlace: Item[], setSelectPosition: any }) {
    return (
        <List
            component="nav"
            aria-label="main mailbox folders"
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 630,
                '& ul': {padding: 0},
            }}>
            {props.listPlace.map((item) => {
                return (
                    <div key={item?.place_id}>
                        <ListItem
                            button
                            onClick={() => {
                                const address = {
                                    fullName: item.display_name,
                                    city: {
                                        name: item.address.city,
                                        latitude: item.lat,
                                        longitude: item.lon,
                                    }
                                } as Address
                                console.log(address)
                                props.setSelectPosition(item);
                            }}
                        >
                            <ListItemIcon>
                                <img
                                    src={"/images/placeholder.png"}
                                    alt="Placeholder"
                                    style={{width: 38, height: 38}}
                                />
                            </ListItemIcon>
                            <ListItemText primary={item?.display_name}/>
                        </ListItem>
                        <Divider/>
                    </div>
                );
            })}
        </List>
    );
}