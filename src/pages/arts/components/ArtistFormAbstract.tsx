import {Box, Grid, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {ChangeEvent, useMemo, useRef, useState} from "react";
import ArtistArtForm from '../../art/artist/AristArtForm';
import ArtistArtInfo from '../../art/artist/ArtistArtInfo';
import {useDeleteArtFile, useGetAllEntityFilesByEntityId, useNewSaveFile, useUploadFile} from "../../../api/FileApi";
import DeleteModal from "../../../components/modal/DeleteModal";
import ImageSlider from "../../../components/ui/ImageSlider";
import {FileService} from "../../../services/FileService";
import {useDeleteArt, useSaveArt} from "../../../api/ArtApi";
import {Art as ArtEntity} from '../../../entities/art';
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import Bubble from "../../../components/bubble/Bubble";
import {buildImageUrl, getErrorMessage} from "../../../util/PrepareDataUtil";
import {Add} from "@mui/icons-material";
import {EntityFile} from "../../../entities/entityFile";

interface Props {
    art: ArtEntity
    canEdit: boolean
    onSubmitSuccess: (art: ArtEntity, files: EntityFile[]) => void
}

const ArtistFormAbstract = ({art, canEdit, onSubmitSuccess}: Props) => {
    const navigate = useNavigate();

    const fileInput = useRef<HTMLInputElement>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [tempImages, setTempImages] = useState<EntityFile[]>([]);
    const [deleted, setDeleted] = useState<Record<string, boolean>>({})

    const {data: fileEntities = []} = useGetAllEntityFilesByEntityId(art?.id);
    const originalFileEntities = fileEntities.filter(fileEntity => fileEntity.type === EntityFileTypeEnum.ORIGINAL);

    const mutationDeleteArt = useDeleteArt();

    const onDelete = async () => {
        mutationDeleteArt.mutateAsync(art?.id).then(() => {
            navigate('/gallery')
            Bubble.success("Art object was deleted");
        }).catch(e => {
            Bubble.error({message: 'Failed to delete art. Error message is ' + getErrorMessage(e), duration: 999999})
        })
    }

    const mutationDeleteFile = useDeleteArtFile();

    const onDeleteFile = async (index: number) => {
        const file = fileEntities?.at(index);
        if(!file) {
            return;
        }
        mutationDeleteFile.mutateAsync(file.id!).then(() => {
            setDeleted({...deleted, [file.id!]: true})
            Bubble.success("Media file removed")
        }).catch(e => {
            Bubble.error({
                message: 'Failed to delete media file. Error message is ' + getErrorMessage(e),
                duration: 999999
            })
        })
    }

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const file = fileList[0];
        return FileService.toBase64fromBlob(file)
            .then(image => setTempImages([...tempImages, {
                isPrimary: false,
                type: EntityFileTypeEnum.ORIGINAL,
                creationDate: new Date(),
                mimeType: file.type,
                data: image
            }]));
    }

    const mutationSaveArt = useSaveArt();

    // const useUpdateFile

    const mutationSaveImage = useUploadFile();

    const onSubmitFile = (art: ArtEntity, file: EntityFile) => {
        file = {...file};
        const commaIndex = file.data.indexOf(",");
        file.data = commaIndex > -1 ? file.data.substring(commaIndex + 1) : file.data;
        return mutationSaveImage.mutateAsync(file).then(response => response.data)
    }

    const handleSubmit = async (art: ArtEntity) => {
        let savedArt: ArtEntity;
        mutationSaveArt.mutateAsync(art)
            .then(response => {
                return response.data
            }).then(art => {
                savedArt = art;
                let existingIsPrimary = false;
                for (let i = 0; i < originalFileEntities.length; i++) {
                    if (originalFileEntities[i].isPrimary && !deleted[originalFileEntities[i].id!]) {
                        existingIsPrimary = true;
                        break;
                    }
                }

                if(!existingIsPrimary) {
                    let tempIsPrimary;
                    for(let i = 0; i < tempImages.length; i++) {
                        if(tempImages[i].isPrimary) {
                            tempIsPrimary = true;
                            break;
                        }
                    }
                    if(!tempIsPrimary && tempImages.length > 0) {
                        tempImages[0].isPrimary = true;
                    }
                }
                tempImages.forEach((image) => {
                    image.entityId = art.id;
                })
                return Promise.all(tempImages.map(file => onSubmitFile(art, file)));
            }).then((files) => {
                onSubmitSuccess(savedArt, files);
            }).catch((e) => {
                Bubble.error({
                    message: 'Failed to update media file. Error message is ' + getErrorMessage(e),
                    duration: 999999
                })
            })
    }

    const mutationSaveFile = useNewSaveFile();

    const handleMakeMainClick = async (mainImageNumber: number) => {
        const toUpdate = originalFileEntities
            .filter((file, index) => index !== mainImageNumber && file.isPrimary)
            .map(file => {
                file.isPrimary = false;
                return file;
            });
        const primary = originalFileEntities[mainImageNumber];
        primary.isPrimary = true;
        toUpdate.push(primary);
        const promises = toUpdate.map((fileEntity) => {
            return mutationSaveFile.mutateAsync(fileEntity)
        })
        await Promise.all(promises).then(() => {
            Bubble.success("Primary file updated")
        }).catch((e) => {
            Bubble.error({
                message: "Failed to update primary file. Error message is " + getErrorMessage(e),
                duration: 999999
            })
        });
    }

    const imagesToShow = useMemo(() => {
        return tempImages
            .map(image => image.data)
            .concat(originalFileEntities
                .filter(file => !deleted[file.id!])
                .map(file => buildImageUrl(file.id!)))
    }, [tempImages, originalFileEntities, deleted])
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

                    {imagesToShow && imagesToShow.length > 0
                        ? <ImageSlider
                            onDelete={onDeleteFile}
                            slides={imagesToShow}
                            handleMakeMainClick={handleMakeMainClick}
                            onImageAdd={() => fileInput.current?.click()}
                        />
                        : <Box
                            component='div'
                            style={{
                                background: '#E8EDF0',
                                width: '100%',
                                height: '100%',
                                position: 'relative'
                            }}
                        >
                            <IconButton
                                size='large'
                                onClick={() => fileInput.current?.click()}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <Add fontSize='large'/>
                            </IconButton>
                        </Box>
                    }
                    <input
                        type='file'
                        ref={fileInput}
                        onChange={handleFileInputChange}
                        style={{display: 'none'}}
                    />
                </div>
            </Grid>
            <Grid item sm={6}>
                {canEdit
                    ? <ArtistArtForm
                        art={art}
                        onDelete={() => setOpenDeleteModal(true)}
                        onSubmit={handleSubmit}/>
                    : <ArtistArtInfo art={art}/>
                }
            </Grid>
            {canEdit && openDeleteModal && <DeleteModal
                open={true}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={onDelete}/>}
        </Grid>

    );
}

export default ArtistFormAbstract;