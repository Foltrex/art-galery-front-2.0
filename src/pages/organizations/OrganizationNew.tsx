import OrganizationForm from "./components/OrganizationForm";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {useNavigate} from "react-router-dom";
import Bubble from "../../components/bubble/Bubble";
import {getErrorMessage} from "../../util/PrepareDataUtil";
import { useCreateOrganization } from "../../api/OrganizationApi";

const OrganizationNew = () => {
    const navigate = useNavigate()
    const mutationAddOrganization = useCreateOrganization();

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
                    console.log(getErrorMessage(error))
                    Bubble.error({message: "Failed to create new organization. Error message: " + getErrorMessage(error), duration: 999999})
                    return false;
                });}
        }/>;
}

export default OrganizationNew;