import OrganizationForm from "./components/OrganizationForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrganizationById} from "../../api/OrganizationApi";
import {ART_SERVICE, axiosApi} from "../../http/axios";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import Bubble from "../../components/bubble/Bubble";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {getErrorMessage, getStatus, isQueryError} from "../../util/PrepareDataUtil";
import {useMemo} from "react";
import Error404 from "../error/Error404";
import Error400 from "../error/Error400";

const OrganizationEdit = () => {
    const matches = useParams();
    const {authStore} = useRootStore();
    const org = useGetOrganizationById(matches.id);
    const navigate = useNavigate()

    const isError = isQueryError(org);
    const errorComponent = useMemo(() => {
        if(isError) {
            const status = getStatus(org);
            if(status === 404) {
                return <Error404 back={"/organizations"}/>
            } else if(status === 400) {
                return <Error400 back={"/organizations"}/>
            }
            Bubble.error("Failed to load organization data. Error message is " + getErrorMessage(org.error));
            return null;
        }
    }, [isError]);

    if(errorComponent) {
        return errorComponent;
    }

    return <OrganizationForm data={org.data} submit={(organization) => {
        organization.id = matches.id!;
        return axiosApi.put(`${ART_SERVICE}/organizations/${matches.id!}`, organization)
            .then(() => {
                Bubble.success("Organization updated successfully");
                authStore.account.accountType === AccountEnum.SYSTEM && navigate('/organizations/');
                return true;
            })
            .catch(error => {
                console.log(getErrorMessage(error))
                Bubble.error({message: "Failed to update organization. Error message: " + getErrorMessage(error), duration: 999999})
                return false
            });}
    }/>;
}

export default OrganizationEdit;
