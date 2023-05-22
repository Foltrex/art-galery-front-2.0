import OrganizationForm from "./components/OrganizationForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrganizationById, useUpdateOrganizationById} from "../../api/OrganizationApi";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import Bubble from "../../components/bubble/Bubble";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {getStatus, isQueryError} from "../../util/PrepareDataUtil";
import {useMemo} from "react";
import Error404 from "../error/Error404";
import Error400 from "../error/Error400";
import {getErrorMessage} from "../../components/error/ResponseError";

const OrganizationEdit = () => {
    const matches = useParams();
    const {authStore} = useRootStore();
    const org = useGetOrganizationById(matches.id, (error) => {
        getErrorMessage("Failed to load organization data", error)
    });
    const navigate = useNavigate()
    const mutationAddOrganization = useUpdateOrganizationById(matches.id!, (error) => {
        getErrorMessage("Failed to update organization", error);
    });

    const isError = isQueryError(org);
    const errorComponent = useMemo(() => {
        if(isError) {
            const status = getStatus(org);
            if(status === 404) {
                return <Error404 back={"/organizations"}/>
            } else if(status === 400) {
                return <Error400 back={"/organizations"}/>
            }
            return null;
        }
    }, [isError, org]);

    if(errorComponent) {
        return errorComponent;
    }

    return <OrganizationForm data={org.data} submit={(organization) => {
        organization.id = matches.id!;
        return mutationAddOrganization.mutateAsync(organization)
            .then(() => {
                Bubble.success("Organization updated successfully");
                authStore.account.accountType === AccountEnum.SYSTEM && navigate('/organizations/');
                return true;
            })
            .catch(error => {
                getErrorMessage("Failed to update organization", error)
                return false
            });}
    }/>;
}

export default OrganizationEdit;
