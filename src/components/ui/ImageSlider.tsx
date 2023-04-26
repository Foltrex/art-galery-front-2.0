import {Button, Modal, Stack} from "@mui/material";
import {Box, styled} from "@mui/system";
import Delete from "@mui/icons-material/Delete";
import Close from "@mui/icons-material/Close";
import {CSSProperties, useState} from "react";

interface IImageSliderProps {
    slides?: string[];
    onDelete?: (index: number) => void;
    onImageAdd?: () => void;
    handleMakeMainClick?: (number: number) => void;
    showLoadMore?: boolean;
    showMakeMain?: boolean;
    styles?: CSSProperties
}
const style:CSSProperties = {
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

const ImageSlider: React.FunctionComponent<IImageSliderProps> = ({
    slides,
    onDelete,
    onImageAdd,
    handleMakeMainClick,
    showLoadMore = true,
    showMakeMain = true,
    styles
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handleLeftArrowClick = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides!.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const handleRightArrowClick = () => {
        const isLastSlide = currentIndex === slides!.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const handleImageClick = () => {
        setShowModal(true);
    }

    const handleDotClick = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    }

    const handleDeleteImageClick = () => {
        if (onDelete) {
            onDelete(currentIndex);
        }

        setShowModal(false)
    }

    return (
        <div style={{
            height: '100%',
            position: 'relative',
            ...styles
        }}>

            <div style={{ background: 'white', width: '100%', height: '100%', textAlign: "center", position: 'relative' }}>
                {slides && (
                    <>
                        <img
                            src={slides[currentIndex]}
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
                        <LeftArrowButton onClick={handleLeftArrowClick}>
                            &#8249;
                        </LeftArrowButton>
                        <RightArrowButton onClick={handleRightArrowClick}>
                            &#8250;
                        </RightArrowButton>
                    </>
                )
                }
            </div>

            {slides && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2vh', marginBottom: '2vh' }}>
                {slides.map((_, index) => (
                    <img
                        src={slides[index]}
                        alt={"img"}
                        onClick={() => handleDotClick(index)}
                        width='50px'
                        height='50px'
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                    />
                ))}
            </div>
            }

            <Stack direction='column' sx={{ px: 30 }} gap={2}>
                {showMakeMain &&
                    <Button
                        onClick={() => {
                            if (handleMakeMainClick) {
                                handleMakeMainClick(currentIndex)
                            }
                        }}
                        variant='outlined'
                        sx={{ p: 1.5, color: 'black', borderColor: 'black' }}
                    >
                        Make this image main
                    </Button>
                }

                {showLoadMore &&
                    <Button
                        variant='outlined'
                        sx={{ p: 1.5, color: 'black', borderColor: 'black' }}
                        onClick={onImageAdd}
                    >
                        Load More
                    </Button>
                }
            </Stack>

            {slides && <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <>
                    <img
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        src={slides[currentIndex]} alt={"img"} />

                    <Box sx={{ position: 'absolute', bottom: '15px', display: 'flex', gap: 10}}>
                        {onDelete && <Button
                            color='error'
                            variant='contained'
                            startIcon={<Delete />}
                            onClick={handleDeleteImageClick}>
                            Delete
                        </Button>}
                        <Button
                            color='info'
                            variant='contained'
                            startIcon={<Close />}
                            onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Box>
                </>
            </Modal>
            }
        </div>
    );
};

export default ImageSlider;
