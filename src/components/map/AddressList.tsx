import { Divider, ListItemIcon } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Address } from "../../entities/address";
import { GeoPosition } from "./SearchBox";

export default function AddressList(props: { listPlace: GeoPosition[], setSelectPosition: any }) {
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
                                    name: item.display_name,
                                    city: {
                                        name: item.address.city,
                                        latitude: item.lat,
                                        longitude: item.lon,
                                    }
                                } as Address
                                props.setSelectPosition(item);
                            }}
                        >
                            <ListItemIcon>
                                <img
                                    src={"./images/placeholder.png"}
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
