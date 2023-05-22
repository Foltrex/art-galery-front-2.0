import * as React from 'react';
import {FacilityFormAbstract} from "./FacilityFormAbstract";
import Bubble from "../../../components/bubble/Bubble";
import {Facility} from "../../../entities/facility";
import {useGetFacilityById, useUpdateFacility} from "../../../api/FacilityApi";
import Loading from "../../../components/ui/Loading";
import {getErrorMessage} from "../../../components/error/ResponseError";


const FacilityEdit = (props:{facilityId: string, onSubmit: (facility:Facility) => void, back:() => void}) => {
    const {data, isLoading, isFetching} = useGetFacilityById(props.facilityId, (error) => {
        getErrorMessage("Failed to load facility details", error);
    });
    const updateFacility = useUpdateFacility(props.facilityId, (errror) => {
        getErrorMessage("Failed to update new facility", errror)
    });
    if(isLoading || isFetching || !data) {
        return <Loading />
    }

    return <FacilityFormAbstract data={data} back={props.back} onSubmit={(facility) => {
        return updateFacility.mutateAsync(facility)
            .then((facility) => {
                Bubble.success("Facility updated")
                props.onSubmit(facility.data);
                return facility.data;
            })
            .catch(() => {
                return null
            });
    }}/>
};

export default FacilityEdit;
