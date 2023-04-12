import * as React from 'react';
import {ART_SERVICE, axiosApi} from "../../../http/axios";
import {FacilityFormAbstract} from "./FacilityFormAbstract";
import Bubble from "../../../components/bubble/Bubble";
import {Facility} from "../../../entities/facility";
import {useGetFacilityById} from "../../../api/FacilityApi";
import Loading from "../../../components/ui/Loading";


const FacilityEdit = (props:{facilityId: string, onSubmit: (facility:Facility) => void, back:() => void}) => {
    const {data, isLoading, isFetching} = useGetFacilityById(props.facilityId);
    if(isLoading || isFetching || !data) {
        return <Loading />
    }
    console.log(data);
    return <FacilityFormAbstract data={data} back={props.back} onSubmit={(facility) => {
        return axiosApi.put(`${ART_SERVICE}/facilities/${facility.id!}`, facility)
            .then(() => {
                Bubble.success("Facility updated")
                props.onSubmit(facility);
                return true;
            })
            .catch(error => {
                Bubble.error({message: "Failed to update facility. Error is: " + error.response.data.message, duration: 999999})
                return false
            });
    }}/>
};

export default FacilityEdit;
