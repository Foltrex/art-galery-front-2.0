import * as React from 'react';
import {useEffect, useState} from 'react';
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
import SearchBox, {GeoPosition} from "./SearchBox";
import {Address} from "../../entities/address";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IMapDialogProps {
    open: boolean;
    onClose: () => void;
    address?: Address | null,
    setFieldValue: (value: Address) => void;
}

export default function MapDialog(props: IMapDialogProps) {
    const [selectPosition, setSelectPosition] = useState<GeoPosition | null>(null);

    useEffect(() => {
        if (props.address && props.address.city) {
            const position = {
                place_id: 1,
                display_name: props.address.name,
                lat: props.address.city.latitude,
                lon: props.address.city.longitude,
                address: {
                    city: props.address.city.name,
                }
            } as GeoPosition
            setSelectPosition(position)
        }
    }, [props.address])


    const save = () => {
        const address = {
            name: selectPosition?.display_name,
            city: {
                name: selectPosition?.address.city,
                latitude: selectPosition?.lat,
                longitude: selectPosition?.lon,
            }
        } as Address
        props.setFieldValue(address);
        props.onClose()
    }

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.onClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Search address
                    </Typography>
                    <Button autoFocus color="inherit"
                            onClick={() => save()}>
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
