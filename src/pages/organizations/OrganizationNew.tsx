import OrganizationForm from "./components/OrganizationForm";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {useNavigate} from "react-router-dom";
import Bubble from "../../components/bubble/Bubble";

const OrganizationNew = () => {
    const navigate = useNavigate()

    return <OrganizationForm
        data={{
            id: '',
            name: '',
            address: null,
            status: OrganizationStatusEnum.NEW,
            facilities: []
        }}
        submit={(organization) => {
            return axiosApi.post(`${ART_SERVICE}/organizations`, organization)
                .then(response => {
                    Bubble.success("Organization created successfully")
                    navigate(`/organizations/${response.data.id}`)
                    return true;
                })
                .catch(error => {
                    Bubble.error({message: "Failed to create new organization. Error message: " + error.response.data.message, duration: 999999})
                    return false;
                });}
        }/>;
}

export default OrganizationNew;