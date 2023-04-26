import React, {useMemo, useState} from "react";
import {GoogleAddress, GooglePlace, GoogleSearchPlace} from "../../entities/GeoPosition";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {TypeFilter} from "../form/TypeFilter";
import {Button, DialogActions, DialogContent, Stack} from "@mui/material";
import AddressList from "./AddressList";
import CancelOutlined from "@mui/icons-material/CancelOutlined";


export default function SearchBox(props: {
    onClose: () => void
    viewBox?: any
    mapPlaces?: {time:number, places: GooglePlace[]}
    setSelectedPosition: (p: GooglePlace) => void
}) {
    const [requestTime, setRequestTime] = useState<number>(0);
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: "AIzaSyAhkJQFztv8tgPCzjbo3zoCH1xg96aVSIM",
    });

    const selectPosition = function (searchPlace:GoogleSearchPlace) {
        if(props.mapPlaces && props.mapPlaces.places) {
            for(let i = 0; i < props.mapPlaces.places.length; i++) {
                const place = props.mapPlaces.places[i];
                if(place.place_id === searchPlace.place_id) {
                    props.setSelectedPosition(place);
                    return;
                }
            }
        }
        placesService.getDetails({
                placeId: searchPlace.place_id,
                fields: ['name', 'address_components', 'geometry', 'place_id']
            },
            (placeDetails: any) => {
                props.setSelectedPosition(placeDetails);
            }
        );
    };

    const placesToShow:GoogleSearchPlace[] = useMemo(() => {
        if(isPlacePredictionsLoading) {
            return [];
        }
        if(props.mapPlaces && props.mapPlaces.places && props.mapPlaces.time > requestTime) {
            return props.mapPlaces.places.map(place => ({
                place_id: place.place_id,
                terms: [{value: new GoogleAddress(place).toString()}]
            }))
        }
        return placePredictions;
    }, [props.mapPlaces, placePredictions, isPlacePredictionsLoading])

    return (
        <Stack
            direction="column"
            alignItems="stretch"
            spacing={2}
            height={'100%'}
        >
            <Stack style={{padding: '20px 25px 0'}}>
                <TypeFilter autoFocus
                            label={"Address"}
                            onChange={(evt) => {
                                setRequestTime(new Date().getTime())
                                getPlacePredictions({
                                    strictBounds:true,
                                    bounds: props.viewBox,
                                    input: evt
                                });
                            }}
                />
            </Stack>
            <DialogContent style={{marginTop: 0, paddingTop: 5}}>
                <AddressList
                    listPlace={placesToShow}
                    setSelectedPosition={selectPosition}
                    isLoading={isPlacePredictionsLoading}
                />
            </DialogContent>
            <DialogActions>
                <Stack width={'100%'} alignItems={"center" }>
                    <Button disableElevation
                            size={"large"}
                            variant={"outlined"}
                            color={"error"}
                            onClick={props.onClose}
                            startIcon={<CancelOutlined/>}
                    >
                        Close
                    </Button>
                </Stack>
            </DialogActions>

        </Stack>
    );
}
