import {Button, IconButton, Modal, Stack, Tooltip} from "@mui/material";
import {Box, styled} from "@mui/system";
import Close from "@mui/icons-material/Close";
import * as React from "react";
import {CSSProperties, useRef, useState} from "react";
import DeleteModal from "../modal/DeleteModal";
import {EntityFileTypeEnum} from "../../entities/enums/EntityFileTypeEnum";
import {EntityFile} from "../../entities/entityFile";
import {Add} from "@mui/icons-material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';
import {useSaveTempFile} from "../../api/FileApi";
import {buildImageUrl, uploadTempFile} from "../../util/PrepareDataUtil";
import {getErrorMessage} from "../error/ResponseError";

interface IImageSliderProps {
    setCurrentIndex: (index:number) => void;
    currentIndex: number
    setSlides?: (files:EntityFile[]) => void
    slides: EntityFile[];
    styles?: CSSProperties,
}

const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: '100%',
    backgroundColor: 'rgb(234, 237, 239)',
    position: 'absolute',
    top: 0,
    fontSize: '55px',
    color: '#fff',
    zIndex: 1,
    cursor: 'pointer'
}
const LeftArrowButton = styled('div')({
    ...style,
    left: 0,
});

const RightArrowButton = styled('div')({
    ...style,
    right: 0,
});

export function Slide({selected, src, onClick}: { src: string, onClick: () => void, selected: boolean }) {
    return <div style={selected ? {opacity: 0.5} : undefined}><img style={{display: "block"}}
                                                                   src={src}
                                                                   alt={"img"}
                                                                   onClick={onClick}
                                                                   height='50px'
    /></div>
}

function ImageSlider({  styles,
                         currentIndex, setCurrentIndex,
                         slides, setSlides
                     }: IImageSliderProps) {


    const fileInput = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const saveFile = useSaveTempFile((e) => {
        getErrorMessage("Failed to upload file", e);
    });

    const handleImageClick = () => {
        setShowModal(true);
    }
    const confirmDelete = () => {
        setShowDeleteModal(true)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        return uploadTempFile(e, saveFile).then(response => {
                setSlides && setSlides([...slides, {
                    id: response.data.id,
                    creationDate: response.data.createdAt + "",
                    isPrimary: slides.length === 0,
                    type: EntityFileTypeEnum.ORIGINAL,
                    entityId: undefined,
                    originalId: undefined
                }]);
            });
    }

    const thumbs = slides
        .filter(slide => slide.type === EntityFileTypeEnum.THUMBNAIL)
        .reduce((map, slide) => {
            map[slide.originalId!] = slide;
            return map;
        }, {} as Record<string, EntityFile>)

    const currentFile = slides[currentIndex];

    return (
        <div style={{
            height: '100%',
            position: 'relative',
            ...styles
        }}>
            {!currentFile && <Box
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
                    onClick={() => {
                        setSlides && fileInput.current?.click()
                    }}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <Add fontSize='large'/>
                </IconButton>
            </Box>}
            {!!currentFile && (<div
                style={{background: 'white', width: '100%', height: '100%', textAlign: "center", position: 'relative'}}>
                <img
                    src={buildImageUrl(currentFile.id!)}
                    onClick={handleImageClick}
                    style={{
                        maxWidth: '100%',
                        height: '100%',
                        width: 'auto',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                    }}
                    alt={'img'}
                />
                <LeftArrowButton onClick={() => {
                    if(currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1)
                    }
                }}>
                    &#8249;
                </LeftArrowButton>
                <RightArrowButton onClick={() => {
                    if(currentIndex < slides.length - 1) {
                        setCurrentIndex(currentIndex + 1)
                    }
                }}>
                    &#8250;
                </RightArrowButton>
            </div>)}
            <div
                style={{display: 'flex', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh', gap: '20px'}}>
                {slides.map((file, i, array) => {
                    if(file.type === EntityFileTypeEnum.ORIGINAL && thumbs[file.id!]) {
                        return null;
                    }
                    let index = -1;
                    if(file.type === EntityFileTypeEnum.ORIGINAL) {
                        index = i;
                    } else {
                        for(let i = 0; i < array.length; i++) {
                            if(array[i].id === file.originalId) {
                                index = i;
                                break;
                            }
                        }
                    }
                    if(index === -1) {
                        return null;
                    }
                    return (
                    <Stack direction={"column"} alignItems={"center"}>
                        <Slide key={index}
                               selected={index !== currentIndex}
                               src={buildImageUrl(file.id!)}
                               onClick={() => setCurrentIndex(index)}/>
                        {file.isPrimary ? "*" : undefined}
                    </Stack>
                )}).filter(v => v)}
            </div>
            <input
                type='file'
                ref={fileInput}
                onChange={handleFileInputChange}
                style={{display: 'none'}}
            />
            <Stack direction="row" spacing={1} alignItems={"center"} justifyContent={"center"}>
                {setSlides && currentFile &&
                    <Tooltip title={"Make image primary. Primary image shown in a list"}>
                        <IconButton onClick={() => {
                            if(currentFile.isPrimary) {
                                return;
                            }
                            const images:EntityFile[] = [];
                            slides.forEach((f) => {
                                const isPrimary = f.id === currentFile.id || f.originalId === currentFile.id;
                                images.push({...f, isPrimary: isPrimary});
                            })
                            setSlides(images);
                        }} color="primary">
                            <FilterOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                }

                {setSlides && currentFile &&
                    <Tooltip title={"Upload more images"}>
                        <IconButton onClick={() => fileInput!.current!.click()} color="primary">
                            <UploadFileIcon/>
                        </IconButton>
                    </Tooltip>
                }
                {setSlides && currentFile &&
                    <Tooltip title={"Delete current image"}>
                        <IconButton onClick={confirmDelete} color="error">
                            <DeleteOutlineIcon color={"error"}/>
                        </IconButton>
                    </Tooltip>
                }
            </Stack>

            {currentFile && showModal && <Modal
                open={true}
                onClose={() => setShowModal(false)}
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                <>
                    <img
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                        src={buildImageUrl(currentFile.id!)} alt={"img"}/>

                    <Box sx={{position: 'absolute', bottom: '15px', display: 'flex', gap: 10}}>
                        <Button
                            color='info'
                            variant='contained'
                            startIcon={<Close/>}
                            onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Box>
                </>
            </Modal>
            }

            {currentFile && showDeleteModal && <DeleteModal
                open={true}
                onClose={() => setShowDeleteModal(false)}
                onDelete={() => {
                    if(setSlides && currentFile) {
                        setSlides(slides.filter(s => s.id !== currentFile.id));
                        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
                    }
                }}
                contextText={"You are about to delete image. Please confirm it was done by purpose. Take a note, image will be deleted only after data submit"}
            />}
        </div>
    );
}

export default ImageSlider;
