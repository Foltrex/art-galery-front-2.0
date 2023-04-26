import * as React from 'react';
import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import Map from "./Map";
import SearchBox from "./SearchBox";
import {Address} from "../../entities/address";
import {GeoPosition, GoogleAddress, GooglePlace} from "../../entities/GeoPosition";

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
    const [selectPosition, setSelectPosition] = useState<GeoPosition>();
    const [viewBox, setViewBox] = useState<any>();
    const [mapPlaces, setMapPlaces] = useState<{time:number, places: GooglePlace[]}>();

    useEffect(() => {
        if (props.address && props.address.city) {
            const position = {
                place_id: 1,
                display_name: props.address.name,
                lat: props.address.city.latitude,
                lng: props.address.city.longitude,
                address: {
                    city: props.address.city.name,
                }
            } as GeoPosition
            setSelectPosition(position)
        }
    }, [props.address])


    function transformPosition(place: GooglePlace) {
        const address = new GoogleAddress(place);
        /*const position:GeoPosition = {
            place_id: 1,
            display_name: address.toString(),
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: {
                city: address.city,
                route: address.route,
                street: address.route,
                house_number: address.house_number,
                village: "",
                place: "",
                natural: "",
                city_district: "",
                state: address.state,
                country: address.country,
                postcode: address.zip,
                region: address.state,
            }
        }*/
        const loc = place.geometry.location
        const obj:Address = {
            name: address.toString(),
            city: {
                id: "",
                name: address.city!,
                latitude: typeof loc.lat === 'function'
                    //@ts-ignore
                    ? loc.lat()
                    : loc.lat,
                longitude: typeof loc.lng === 'function'
                    //@ts-ignore
                    ? loc.lng()
                    : loc.lng,
            }
        };
        props.setFieldValue(obj);
        props.onClose()
    }

    return (
        <Dialog
            fullScreen
            open={props.open}
            onClose={props.onClose}
            TransitionComponent={Transition}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100vh",
                }}
            >
                <div style={{flexBasis: '600px'}}>
                    <SearchBox viewBox={viewBox} onClose={props.onClose} mapPlaces={mapPlaces} setSelectedPosition={transformPosition}/>
                </div>
                <div style={{height: "100%", flexGrow: 1}}>
                    <Map selectedPosition={selectPosition} setViewBox={setViewBox} onClick={(places) => setMapPlaces({time:new Date().getTime(), places:places})}/>
                </div>
            </div>
        </Dialog>
    );
}
