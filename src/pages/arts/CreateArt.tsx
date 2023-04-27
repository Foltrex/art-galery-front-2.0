import ArtistFormAbstract from "./components/ArtistFormAbstract";
import {ArtSize} from "../../entities/art-size";
import Bubble from "../../components/bubble/Bubble";
import {useNavigate} from "react-router-dom";
import {useRootStore} from "../../stores/provider/RootStoreProvider";

export const CreateArt = () => {
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const account = authStore.account;

    return <ArtistFormAbstract
        canEdit={true}
        art={{
            name: '',
            description: '',
            artistAccountId: account.id,
            artStyles: [],
            artSize: {} as ArtSize,
            dateCreation: new Date()
        }}
        onSubmitSuccess={() => {
            Bubble.success("Art created successfully");
            navigate(`/gallery/`);
        }}
    />
}