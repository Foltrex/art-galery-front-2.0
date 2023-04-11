import OrganizationForm from "./components/OrganizationForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrganizationById} from "../../api/OrganizationApi";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

const OrganizationEdit = () => {
    const matches = useParams();
    const {alertStore} = useRootStore();
    const {data} = useGetOrganizationById(matches.id);
    const navigate = useNavigate()

    return <OrganizationForm data={data} submit={(organization) => {
        organization.id = matches.id!;
        return axiosApi.put(`${ART_SERVICE}/organizations/${matches.id!}`, organization)
            .then(() => {
                alertStore.setShow(true, "success", "", "Organization updated successfully")
                navigate(`/organizations/`)
                return true;
            })
            .catch(error => {
                alertStore.setShow(true, "error", "Something went wrong. Try again", error.response.data.message)
                return false
            });}
    }/>;
}

export default OrganizationEdit;
