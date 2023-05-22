import {Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {useState} from "react";
import ArtForm from './ArtForm';
import ArtistArtInfo from './ArtInfo';
import DeleteModal from "../../../components/modal/DeleteModal";
import ImageSlider from "../../../components/ui/ImageSlider";
import {useDeleteArt, useSaveArt} from "../../../api/ArtApi";
import {Art, Art as ArtEntity} from '../../../entities/art';
import Bubble from "../../../components/bubble/Bubble";
import {EntityFile} from "../../../entities/entityFile";
import {getErrorMessage} from "../../../components/error/ResponseError";

interface Props {
    art: ArtEntity
    canEdit: boolean
    onSubmitSuccess: (art: ArtEntity) => void
}



const ArtistFormAbstract = ({art, canEdit, onSubmitSuccess}: Props) => {
    const navigate = useNavigate();
    const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [forceCanEdit, setForceCanEdit] = useState<boolean>()
    const [tempArt, setTempArt] = useState<Art>()
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [tempImages, setTempImages] = useState<EntityFile[]>([]);

    const mutationDeleteArt = useDeleteArt(e => {
        getErrorMessage('Failed to delete art', e);
    });

    const [slides, setSlides] = useState(art.files || []);



    const mutationSaveArt = useSaveArt((e) => {
        getErrorMessage(art.id
            ? 'Failed to update art object'
            : 'Failed to create new art object', e)});


    const handleSubmit = async (art: ArtEntity) => {
        return mutationSaveArt.mutateAsync(art)
            .then(response => {
                return onSubmitSuccess(response.data);
            })
    }

    if (forceCanEdit !== undefined) {
        canEdit = forceCanEdit;
    }

    return (
        <Grid container
              spacing={0}
              justifyContent="center"
        >
            <Grid item sm={6}>
                <div style={{
                    width: 'auto',
                    height: '380px',
                    margin: '0 15px',
                }}>

                    <ImageSlider
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        slides={slides}
                        setSlides={canEdit ? setSlides : undefined}
                    />


                </div>
            </Grid>
            <Grid item sm={6}>
                {canEdit
                    ? <ArtForm
                        files={slides}
                        canEdit={canEdit}
                        switchMode={(canEdit, art) => {
                            setForceCanEdit(canEdit);
                            art && setTempArt(art)
                        }}
                        art={tempArt || art}
                        onDelete={() => setOpenDeleteModal(true)}
                        onSubmit={handleSubmit}/>
                    : <ArtistArtInfo art={tempArt || art} canEdit={canEdit}
                                     switchMode={(canEdit) => setForceCanEdit(canEdit)}/>
                }
            </Grid>
            {canEdit && openDeleteModal && <DeleteModal
                open={true}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={() => mutationDeleteArt.mutateAsync(art?.id).then(() => {
                    navigate('/gallery')
                    Bubble.success("Art object was deleted");
                })}/>}
        </Grid>

    );
}

export default ArtistFormAbstract;