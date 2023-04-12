import OrganizationForm from "./components/OrganizationForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrganizationById} from "../../api/OrganizationApi";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import Bubble from "../../components/bubble/Bubble";
import {AccountEnum} from "../../entities/enums/AccountEnum";

const OrganizationEdit = () => {
    const matches = useParams();
    const {authStore} = useRootStore();
    const {data} = useGetOrganizationById(matches.id);
    const navigate = useNavigate()

    return <OrganizationForm data={data} submit={(organization) => {
        organization.id = matches.id!;
        return axiosApi.put(`${ART_SERVICE}/organizations/${matches.id!}`, organization)
            .then(() => {
                Bubble.success("Organization updated successfully");
                authStore.account.accountType === AccountEnum.SYSTEM && navigate('/organizations/');
                return true;
            })
            .catch(error => {
                Bubble.error({message: "Failed to update organization. Error message: " + error.response.data.message, duration: 999999})
                return false
            });}
    }/>;
}

export default OrganizationEdit;
