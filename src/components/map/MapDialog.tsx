import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import Map from "./Map";
import SearchBox, {Item} from "./SearchBox";
import {Address} from "../../entities/address";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MapDialog(props: any) {

    const [selectPosition, setSelectPosition] = useState<Item | null>(null);

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Search address
                    </Typography>
                    <Button autoFocus color="inherit"
                            onClick={() => {
                                const address = {
                                    fullName: selectPosition?.display_name,
                                    city: {
                                        name: selectPosition?.address.city,
                                        latitude: selectPosition?.lat,
                                        longitude: selectPosition?.lon,
                                    }
                                } as Address
                                if (address.city?.name !== undefined) {
                                    props.setFieldValue(address);
                                    props.handleClose()
                                } else {
                                    alert("error")
                                }
                            }}>
                        Save and close
                    </Button>
                </Toolbar>
            </AppBar>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <div style={{width: "50vw", height: "100%"}}>
                    <Map selectPosition={selectPosition}/>
                </div>
                <div style={{width: "50vw"}}>
                    <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}/>
                </div>
            </div>
        </Dialog>
    );
}