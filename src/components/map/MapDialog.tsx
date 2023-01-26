import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import Maps from "./Maps";
import SearchBox from "./SearchBox";
import {useState} from "react";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MapDialog(props: any) {

    const [selectPosition, setSelectPosition] = useState(null);

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
                        <Button autoFocus color="inherit" onClick={props.handleClose}>
                            save
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
                    <div style={{ width: "50vw", height: "100%" }}>
                        <Maps selectPosition={selectPosition} />
                    </div>
                    <div style={{ width: "50vw" }}>
                        <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}/>
                    </div>
                </div>
            </Dialog>
    );
}