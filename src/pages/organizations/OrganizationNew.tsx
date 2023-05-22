import OrganizationForm from "./components/OrganizationForm";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {useNavigate} from "react-router-dom";
import Bubble from "../../components/bubble/Bubble";

import {useCreateOrganization} from "../../api/OrganizationApi";
import {getErrorMessage} from "../../components/error/ResponseError";

const OrganizationNew = () => {
    const navigate = useNavigate()
    const mutationAddOrganization = useCreateOrganization((error) => {
        getErrorMessage("Failed to create new organization", error);
    });

    return <OrganizationForm
        data={{
            id: '',
            name: '',
            address: null,
            status: OrganizationStatusEnum.ACTIVE,
            facilities: []
        }}
        submit={(organization) => {
            return mutationAddOrganization.mutateAsync(organization)
                .then(response => {
                    Bubble.success("Organization created successfully")
                    navigate(`/organizations/${response.data.id}`)
                    return true;
                })
                .catch(error => {
                    getErrorMessage("Failed to create new organization", error);
                    return false;
                });}
        }/>;
}

export default OrganizationNew;