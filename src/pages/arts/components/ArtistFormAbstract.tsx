import {Grid, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";

import {useMemo, useState} from "react";
import ArtForm from './ArtForm';
import ArtistArtInfo from './ArtInfo';
import {uploadArtFile, useDeleteArtFile, useGetAllEntityFilesByEntityId, useNewSaveFile,} from "../../../api/FileApi";
import DeleteModal from "../../../components/modal/DeleteModal";
import ImageSlider, {Slide} from "../../../components/ui/ImageSlider";
import {useDeleteArt, useSaveArt} from "../../../api/ArtApi";
import {Art, Art as ArtEntity} from '../../../entities/art';
import {EntityFileTypeEnum} from "../../../entities/enums/EntityFileTypeEnum";
import Bubble from "../../../components/bubble/Bubble";
import {buildImageUrl, getErrorMessage} from "../../../util/PrepareDataUtil";
import {EntityFile} from "../../../entities/entityFile";

interface Props {
    art: ArtEntity
    canEdit: boolean
    onSubmitSuccess: (art: ArtEntity, files: EntityFile[]) => void
}

function compareFiles(a: EntityFile, b: EntityFile) {
    if (a.isPrimary) {
        return -1;
    }
    if (b.isPrimary) {
        return 1;
    }
    return new Date(a.creationDate).getTime() > new Date(b.creationDate).getTime() ? 1 : -1;
}

function toChain(chainIndex:number, chain:EntityFile[], results:EntityFile[], executor: (file:EntityFile) => Promise<EntityFile>):Promise<EntityFile[]> {
    if(chain[chainIndex]) {
        return executor(chain[chainIndex]).then((result) => {
            results.push(result);
            return toChain(chainIndex + 1, chain, results, executor)
        });
    } else {
        return new Promise(r => r(results));
    }
}

const ArtistFormAbstract = ({art, canEdit, onSubmitSuccess}: Props) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [forceCanEdit, setForceCanEdit] = useState<boolean>()
    const [tempArt, setTempArt] = useState<Art>()
    const [fileKey, setFileKey] = useState(0);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [tempImages, setTempImages] = useState<EntityFile[]>([]);

    const {data: fileEntities = []} = useGetAllEntityFilesByEntityId(fileKey, art?.id);

    const filesArray = useMemo(() => {
        if (art.id) {
            return [...fileEntities]
                .filter(fileEntity => fileEntity.type === EntityFileTypeEnum.ORIGINAL)
                .sort(compareFiles);
        } else {
            return [...tempImages].sort(compareFiles);
        }
    }, [art.id, fileEntities, tempImages])

    const currentFile = filesArray[currentIndex];

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

    const onDeleteTempFile = async (file: EntityFile) => {
        for (let i = 0; i < tempImages.length; i++) {
            if (tempImages[i] === file) {
                tempImages.splice(i, 1);
                setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
                setTempImages([...tempImages]);
                break;
            }
        }
        return new Promise<boolean>(r => r(true));
    }
    const onDeleteFile = (file: EntityFile) => {
        return mutationDeleteFile.mutateAsync(file.id!).then(() => {
            setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
            Bubble.success("Media file removed");
            setFileKey(fileKey + 1);
            return true;
        }).catch(e => {
            Bubble.error({
                message: 'Failed to delete media file. Error message is ' + getErrorMessage(e),
                duration: 999999
            })
            return false;
        })
    }

    const onImageAdd = (file: EntityFile) => {
        if (art.id) {
            const commaIndex = file.data.indexOf(",");
            file.data = commaIndex > -1 ? file.data.substring(commaIndex + 1) : file.data;
            return uploadArtFile(art.id!, file).then(response => {
                setFileKey(fileKey + 1);
                return response.data;
            }).catch(e => {
                Bubble.error("Failed to upload file, error message is " + getErrorMessage(e));
            })
        } else {
            setTempImages([...tempImages, file])
        }
    }

    const mutationSaveArt = useSaveArt();


    const handleSubmit = async (art: ArtEntity) => {
        let savedArt: ArtEntity;
        return mutationSaveArt.mutateAsync(art)
            .then(response => {
                return response.data
            }).then(art => {
            savedArt = art;
            let existingIsPrimary = false;
            for (let i = 0; i < filesArray.length; i++) {
                if (filesArray[i].isPrimary) {
                    existingIsPrimary = true;
                    break;
                }
            }

            if (!existingIsPrimary) {
                let tempIsPrimary;
                for (let i = 0; i < tempImages.length; i++) {
                    if (tempImages[i].isPrimary) {
                        tempIsPrimary = true;
                        break;
                    }
                }
                if (!tempIsPrimary && tempImages.length > 0) {
                    tempImages[0].isPrimary = true;
                }
            }
            tempImages.forEach((image) => {
                image.entityId = art.id;
            })

            const chain = tempImages.map(file => {
                file = {...file};
                const commaIndex = file.data.indexOf(",");
                file.data = commaIndex > -1 ? file.data.substring(commaIndex + 1) : file.data;
                return file
            });
            return toChain(0, chain, [], (file:EntityFile) => uploadArtFile(art.id!, file).then(response => response.data));
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

    const handleMakeMainClick = async () => {
        if (art.id) {
            return mutationSaveFile
                .mutateAsync({...filesArray[currentIndex], isPrimary: true})
                .then(() => {
                    setCurrentIndex(0);
                    Bubble.success("Primary file updated")
                }).catch((e) => {
                    Bubble.error({
                        message: "Failed to update primary file. Error message is " + getErrorMessage(e),
                        duration: 999999
                    })
                });
        } else {
            const files = [...tempImages];
            files[currentIndex] = {...currentFile, isPrimary: true}
            setTempImages(files)
        }
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
                        canEdit={canEdit}
                        onDelete={currentFile && (art.id ? () => onDeleteFile(currentFile) : () => onDeleteTempFile(currentFile))}
                        image={currentFile && (art.id ? buildImageUrl(currentFile.id!) : currentFile.data)}
                        goLeft={() => {
                            currentIndex > 1 && setCurrentIndex(currentIndex - 1)
                        }}
                        goRight={() => currentIndex < filesArray.length - 2 && setCurrentIndex(currentIndex + 1)}
                        makeMain={handleMakeMainClick}
                        onImageAdd={onImageAdd}
                    >
                        {filesArray.map((file, index) => (
                            <Stack direction={"column"} alignItems={"center"}>
                                <Slide key={index}
                                       selected={index !== currentIndex}
                                       src={art.id ? buildImageUrl(file.id!) : file.data}
                                       onClick={() => setCurrentIndex(index)}/>
                                {file.isPrimary ? "*" : undefined}
                            </Stack>
                        ))}
                    </ImageSlider>

                </div>
            </Grid>
            <Grid item sm={6}>
                {canEdit
                    ? <ArtForm
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
                onDelete={onDelete}/>}
        </Grid>

    );
}

export default ArtistFormAbstract;