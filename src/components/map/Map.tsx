import React from 'react';
import "leaflet/dist/leaflet.css";
import {GeoPosition, GoogleAddress, GooglePlace} from "../../entities/GeoPosition";
import GoogleMapReact from 'google-map-react';
import Bubble from "../bubble/Bubble";

const defaultPostion = {lat: 41.64267979147652, lng: 41.62999547636612};

interface MapPropsInner {
    selectedPosition?: GeoPosition,
    onClick?: (places: GooglePlace[]) => void,//if onCLick not provided, search lookup is not done
    setViewBox: (v: any) => void
}

function gmGetter() {
    //@ts-ignore
    return google?.maps;
}

function gmLoader(resolve: (maps: any) => void) {
    if (gmGetter()) {
        resolve(gmGetter())
    } else {
        const interval = setInterval(() => {
            if (gmGetter()) {
                resolve(gmGetter())
                clearInterval(interval);
            }
        }, 500);
    }
}

const AnyReactComponent = ({text}: { lat: number, lng: number, text: string }) => <div>{text}</div>;

const Map = ({selectedPosition, setViewBox, onClick}: MapPropsInner) => {
    const renderMarkers = (map: any, maps: any) => {
        if (!selectedPosition) {
            return null;
        }
        return new maps.Marker({
            position: {lat: selectedPosition.lat, lng: selectedPosition.lng},
            map,
            title: 'Hello World!'
        });
    };

    function updateBounds(map: any) {
        setViewBox(map.getBounds())
    }

    return <div style={{height: '100vh', width: '100%'}}>
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals={true}
            googleMapLoader={() => new Promise(gmLoader)}
            defaultCenter={defaultPostion}
            defaultZoom={17}
            center={selectedPosition ? {lat: selectedPosition.lat, lng: selectedPosition.lng} : undefined}
            onGoogleApiLoaded={({map, maps}) => {
                renderMarkers(map, maps);
                var geocoder = new maps.Geocoder();
                map.addListener("bounds_changed", () => {
                    updateBounds(map);
                });
                map.addListener("click", (a: any, b: any, c: any, d: any, e: any) => {
                    if(!onClick) {
                        return;
                    }
                    geocoder.geocode({
                        'latLng': a.latLng,
                        bounds: map.getBounds(),
                    }, function (results: any, status: any) {
                        if (status === maps.GeocoderStatus.OK) {
                            const res = ((results || []) as GooglePlace[])
                                .sort((v1, v2) => v2.address_components.length - v1.address_components.length)
                                .filter((r) => new GoogleAddress(r).route);
                            if (!res.length) {
                                Bubble.warning("No any viable address found in selected area");
                                onClick([]);
                            } else {
                                onClick(res);
                            }
                        } else {
                            Bubble.error("Failed to detect address, status is " + status);
                        }
                    });
                });
                updateBounds(map);
            }}
        >
        </GoogleMapReact>
    </div>
}


export default Map;
