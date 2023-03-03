import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

const icon = L.icon({
    iconUrl: "./images/placeholder.png",
    iconSize: [38, 38],
});

const position = {lat: 39, lng: 34};

function ResetCenterView(props: { selectPosition: any; }) {
    const {selectPosition} = props;
    const map = useMap();

    useEffect(() => {
        if (selectPosition) {
            map.setView(
                L.latLng(selectPosition?.lat, selectPosition?.lon),
                10,
                {
                    animate: true
                }
            )
        }
    }, [selectPosition]);

    return null;
}

export default function Map(props: { selectPosition: any; }) {
    const {selectPosition} = props;

    const locationSelection = {
        lat: selectPosition?.lat,
        lng: selectPosition?.lon
    }

    return (
        <MapContainer
            center={position}
            zoom={2}
            style={{width: "100%", height: "100%"}}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=H1V9i7jNhJI9fWgWdvVR"
            />
            {selectPosition && (
                <Marker
                    position={locationSelection}
                    icon={icon}>
                </Marker>
            )}
            <ResetCenterView selectPosition={selectPosition}/>
        </MapContainer>
    );
}
