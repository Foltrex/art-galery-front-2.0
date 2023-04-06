import {Divider, ListItemIcon} from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {GeoPosition} from "./SearchBox";
import Loading from "../ui/Loading";

export default function AddressList(props: { listPlace: GeoPosition[], setSelectPosition: any, isLoading: boolean }) {

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
                        <ListItem
                            button
                            onClick={() => {
                                props.setSelectPosition(item);
                            }}
                        >
                            <ListItemIcon>
                                <img
                                    src={"./images/placeholder.png"}
                                    alt="Placeholder"
                                    style={{width: 32, height: 32}}
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
