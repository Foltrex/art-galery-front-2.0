import * as React from 'react';
import Gallery from "./Gallery";
import {useNavigate} from "react-router-dom";

export function GalleryRoute() {
    const navigate = useNavigate();

    return <Gallery createNew={true} onClick={(art) => navigate('/gallery/' + art.id)}/>
}

