import * as React from 'react';
import {ART_SERVICE, axiosApi} from "../../../http/axios";
import {FacilityFormAbstract} from "./FacilityFormAbstract";
import Bubble from "../../../components/bubble/Bubble";
import {Facility} from "../../../entities/facility";
import {getErrorMessage} from "../../../util/PrepareDataUtil";


const FacilityNew = (props:{back: () => void, organizationId?: string, onSubmit: (facility:Facility) => void}) => {
    return <FacilityFormAbstract back={props.back} data={{
        id: '',
        name: '',
        organizationId: props.organizationId || '',
        isActive: true,
    } as Facility} onSubmit={(facility) => {
        return axiosApi.post<Facility>(`${ART_SERVICE}/facilities`, facility)
            .then(response => {
                Bubble.success("Facility created successfully");
                props.onSubmit(response.data)
                return true;
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                Bubble.error({message: "Failed to create new facility. Error message is:" + getErrorMessage(error), duration: 999999})
                return false
            });
    }}/>
};

export default FacilityNew;
