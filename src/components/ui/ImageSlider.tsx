import {Button, IconButton, Modal, Stack, Tooltip} from "@mui/material";
import {Box, styled} from "@mui/system";
import Close from "@mui/icons-material/Close";
import {ChangeEvent, CSSProperties, useRef, useState} from "react";
import DeleteModal from "../modal/DeleteModal";
import {FileService} from "../../services/FileService";
import {EntityFileTypeEnum} from "../../entities/enums/EntityFileTypeEnum";
import {EntityFile} from "../../entities/entityFile";
import {Add} from "@mui/icons-material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterOutlinedIcon from '@mui/icons-material/FilterOutlined';

interface IImageSliderProps {
    image: string
    onImageAdd?: (file:EntityFile) => void;
    goLeft: () => void;
    goRight: () => void;

    makeMain?: () => void;
    onDelete?: () => void;
    canEdit?: boolean;
    styles?: CSSProperties,
    children: React.ReactNode
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

function ImageSlider({children, image, goLeft, goRight, canEdit, onImageAdd, makeMain,
                         onDelete, styles}: IImageSliderProps) {


    const fileInput = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleImageClick = () => {
        setShowModal(true);
    }
    const confirmDelete = () => {
        setShowDeleteModal(true)
    }


    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files!;
        const file = fileList[0];
        return FileService.toBase64fromBlob(file)
            .then(image => {
                onImageAdd && onImageAdd({
                    isPrimary: false,
                    type: EntityFileTypeEnum.ORIGINAL,
                    creationDate: new Date().toJSON(),
                    mimeType: file.type,
                    data: image
                });
            });
    }

    return (
        <div style={{
            height: '100%',
            position: 'relative',
            ...styles
        }}>
            {!image && <Box
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
                    onClick={() => {canEdit && fileInput.current?.click()}}
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
            <div
                style={{background: 'white', width: '100%', height: '100%', textAlign: "center", position: 'relative'}}>
                {!!image && (
                    <>
                        <img
                            src={image}
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
                        <LeftArrowButton onClick={goLeft}>
                            &#8249;
                        </LeftArrowButton>
                        <RightArrowButton onClick={goRight}>
                            &#8250;
                        </RightArrowButton>
                    </>
                )
                }
            </div>

            <div
                style={{display: 'flex', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh', gap: '20px'}}>
                {children}
            </div>
            <input
                type='file'
                ref={fileInput}
                onChange={handleFileInputChange}
                style={{display: 'none'}}
            />
            <Stack direction="row" spacing={1} alignItems={"center"} justifyContent={"center"}>
                {makeMain && canEdit && image &&
                    <Tooltip title={"Make image primary. Primary images shown in a list"}>
                        <IconButton onClick={() => {makeMain && makeMain()}} color="primary">
                            <FilterOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                }

                {onImageAdd && canEdit &&
                    <Tooltip title={"Upload more images"}>
                        <IconButton onClick={() => fileInput!.current!.click()} color="primary">
                            <UploadFileIcon />
                        </IconButton>
                    </Tooltip>
                }
                {onDelete && canEdit &&
                    <Tooltip title={"Delete current image"}>
                        <IconButton onClick={confirmDelete} color="error">
                            <DeleteOutlineIcon color={"error"}/>
                        </IconButton>
                    </Tooltip>
                }
            </Stack>

            {image && showModal && <Modal
                open={true}
                onClose={() => setShowModal(false)}
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                <>
                    <img
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                        src={image} alt={"img"}/>

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

            {image && showDeleteModal && <DeleteModal
                open={true}
                onClose={() => setShowDeleteModal(false)}
                onDelete={() => onDelete && onDelete()}
                contextText={"Please confirm your intention to delete following image"}
            />}
        </div>
    );
}

export default ImageSlider;
