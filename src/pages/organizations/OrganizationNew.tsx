import OrganizationForm from "./components/OrganizationForm";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {OrganizationStatusEnum} from "../../entities/enums/organizationStatusEnum";
import {useNavigate} from "react-router-dom";

const OrganizationNew = () => {
    const {alertStore} = useRootStore();
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
                    alertStore.setShow(true, "success", "", "Organization created successfully")
                    navigate(`/organizations/${response.data.id}`)
                    return true;
                })
                .catch(error => {
                    alertStore.setShow(true, "error", "Something went wrong. Try again", error.response.data.message)
                    return false;
                });}
        }/>;
}

export default OrganizationNew;