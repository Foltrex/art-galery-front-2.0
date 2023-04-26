import ArtistFormAbstract from "./components/ArtistFormAbstract";
import {ArtSize} from "../../entities/art-size";
import Bubble from "../../components/bubble/Bubble";
import {useSaveArt} from "../../api/ArtApi";
import {useNavigate} from "react-router-dom";

export const CreateArt = () => {
    const navigate = useNavigate();
    const mutationSaveArt = useSaveArt();

    return <ArtistFormAbstract
        canEdit={true}
        art={{
            name: '',
            description: '',
            artistAccountId: '',
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