import * as React from 'react';
import {ART_SERVICE, axiosApi} from "../../../http/axios";
import {FacilityFormAbstract} from "./FacilityFormAbstract";
import Bubble from "../../../components/bubble/Bubble";
import {Facility} from "../../../entities/facility";


const FacilityNew = (props:{back: () => void, onSubmit: (facility:Facility) => void}) => {
    return <FacilityFormAbstract back={props.back} data={{
        id: '',
        name: '',
        isActive: false,
    } as Facility} onSubmit={(facility) => {
        return axiosApi.post<Facility>(`${ART_SERVICE}/facilities`, facility)
            .then(response => {
                Bubble.success("Facility created successfully");
                props.onSubmit(response.data)
                return true;
            })
            .catch(error => {
                Bubble.error({message: "Failed to create new facility. Error message is:" + error.response.data.message, duration: 999999})
                return false
            });
    }}/>
};

export default FacilityNew;
