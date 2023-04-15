import { Box, Button, Modal, Stack } from "@mui/material";
import { Container, fontSize, styled } from "@mui/system";
import Delete from "@mui/icons-material/Delete";
import { CSSProperties, useState } from "react";

interface IImageSliderProps {
    slides?: string[];
    onDelete?: (index: number) => void;
    onImageAdd?: () => void;
    handleMakeMainClick?: (number: number) => void;
    showLoadMore?: boolean;
    showMakeMain?: boolean;
    styles?: CSSProperties
}

const LeftArrowButton = styled('div')({
    paddingTop: '25%',
    textAlign: 'center',
    width: 60,
    height: '100%',
    backgroundColor: 'rgb(234, 237, 239)',
    position: 'absolute',
    top: '0',
    left: -60,
    fontSize: '55px',
    color: '#fff',
    zIndex: 1,
    cursor: 'pointer'
});

const RightArrowButton = styled('div')({
    paddingTop: '25%',
    textAlign: 'center',
    width: 60,
    height: '100%',
    backgroundColor: 'rgb(234, 237, 239)',
    position: 'absolute',
    top: '0',
    right: -60,
    fontSize: '55px',
    color: '#fff',
    zIndex: 1,
    cursor: 'pointer'
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
                            alt={slides[currentIndex]}
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
                        // style={{ maxWidth: '100%', maxHeight: '85%', minWidth: '45%' }}
                        style={{ maxWidth: '99%', maxHeight: '99%' }}
                        src={slides[currentIndex]} />

                    <Button
                        sx={{ position: 'absolute', bottom: '10%', borderRadius: 8 }}
                        color='error'
                        variant='contained'
                        startIcon={<Delete />}
                        onClick={handleDeleteImageClick}>
                        Delete
                    </Button>
                </>
            </Modal>
            }
        </div>
    );
};

export default ImageSlider;
