import {Divider, ListItemButton, ListItemIcon} from "@mui/material";
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Loading from "../ui/Loading";
import {GoogleSearchAddress, GoogleSearchPlace} from "../../entities/GeoPosition";
import {memo} from "react";

interface AddressListProps {
    listPlace: GoogleSearchPlace[],
    setSelectedPosition: (p:GoogleSearchPlace) => void,
    isLoading: boolean
}
export default memo(function AddressList(props:AddressListProps) {
    if (props.isLoading) {
        return <div style={{marginTop: "10px"}}><Loading/></div>
    }
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
                        <ListItemButton
                            onClick={() => {
                                props.setSelectedPosition(item);
                            }}
                        >
                            <ListItemIcon>
                                <img
                                    src={"./images/placeholder.png"}
                                    alt="Placeholder"
                                    style={{width: 32, height: 32}}
                                />
                            </ListItemIcon>
                            <ListItemText primary={new GoogleSearchAddress(item).toString()}/>
                        </ListItemButton>
                        <Divider/>
                    </div>
                );
            })}
        </List>
    );
}, propsAreEqual)
function propsAreEqual(p:AddressListProps, n:AddressListProps) {
    if(p.isLoading !== n.isLoading) {
        return false;
    }
    if(p.listPlace?.length !== n.listPlace?.length) {
        return false;
    }
    const map = p.listPlace.reduce((p, n) => {
        p[n.place_id] = true;
        return p;
    }, {} as Record<string, boolean>)
    for(let i = 0; i < n.listPlace.length; i++) {
        if(!map[n.listPlace[i].place_id]) {
            return false;
        }
    }
    return true;
}