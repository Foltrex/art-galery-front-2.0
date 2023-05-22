import * as React from 'react';
import {FacilityFormAbstract} from "./FacilityFormAbstract";
import Bubble from "../../../components/bubble/Bubble";
import {Facility} from "../../../entities/facility";
import {useSaveFacility} from "../../../api/FacilityApi";
import {getErrorMessage} from "../../../components/error/ResponseError";


const FacilityNew = (props:{back: () => void, organizationId?: string, onSubmit: (facility:Facility) => void}) => {
    const createFacility = useSaveFacility((errror) => {
        getErrorMessage("Failed to create new facility", errror)
    });

    return <FacilityFormAbstract back={props.back} data={{
        id: '',
        name: '',
        organizationId: props.organizationId || '',
        isActive: true,
    } as Facility} onSubmit={(facility) => {
        return createFacility.mutateAsync(facility)
            .then(response => {
                Bubble.success("Facility created successfully");
                props.onSubmit(response.data)
                return facility;
            })
            .catch(error => {
                return null
            });
    }}/>
};

export default FacilityNew;
