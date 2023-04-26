import ArtistFormAbstract from "./components/ArtistFormAbstract";
import {useNavigate, useParams} from "react-router-dom";
import {useGetArtById, useSaveArt} from "../../api/ArtApi";
import Loading from "../../components/ui/Loading";
import Error404 from "../error/Error404";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import Bubble from "../../components/bubble/Bubble";

export const EditArt = () => {
    const navigate = useNavigate();
    const {id: artId} = useParams();
    const mutationSaveArt = useSaveArt();
    const {isLoading, data} = useGetArtById(artId!);
    const {authStore} = useRootStore();
    if (isLoading) {
        return <Loading/>
    }
    if (!data) {
        return <Error404 back={"/gallery"}/>
    }
    const canEdit = authStore.account.id === data.artistAccountId || authStore.account.accountType === AccountEnum.SYSTEM

    return <ArtistFormAbstract
        art={data}
        canEdit={canEdit}
        onSubmitSuccess={() => {
            navigate("/gallery");
            Bubble.success("Data updated");
        }}/>
}