
import { Button, Modal } from "@mui/material";
import { Container, fontSize, styled } from "@mui/system";
import Delete from "@mui/icons-material/Delete";
import { useState } from "react";

interface IImageSliderProps {
	slides?: string[];
	onDelete: (index: number) => void;
}

const LeftArrowButton = styled('div')({
	position: 'absolute',
	top: '50%',
	transform: 'translate(0, -50%)',
	left: '22px',
	fontSize: '55px',
	color: '#fff',
	zIndex: 1,
	cursor: 'pointer'
});

const RightArrowButton = styled('div')({
	position: 'absolute',
	top: '50%',
	transform: 'translate(0, -50%)',
	right: '22px',
	fontSize: '55px',
	color: '#fff',
	zIndex: 1,
	cursor: 'pointer'
});

interface SliderImageProps {
	src: string;
}

const SliderImage = styled('div', {
	shouldForwardProp: prop => prop !== 'src'
})<SliderImageProps>(({ src }) => ({
	backgroundImage: `url(${src})`,
	height: '100%',
	width: 'auto',
	borderRadius: '10px',
	backgroundPosition: 'center',
	backgroundSize: 'contain',
	backgroundRepeat: 'no-repeat'
}));

const ImageSlider: React.FunctionComponent<IImageSliderProps> = ({ slides, onDelete }) => {
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
		onDelete(currentIndex);
		setShowModal(false)
	}

	return (
		<div style={{
			height: '100%',
			position: 'relative'
		}}>
			{slides && <LeftArrowButton onClick={handleLeftArrowClick}>
				&#8249;
			</LeftArrowButton>
			}
			{slides && <RightArrowButton onClick={handleRightArrowClick}>
				&#8250;
			</RightArrowButton>
			}

			<div style={{ background: '#E8EDF0', width: '100%', height: '100%' }}>
				{slides && <SliderImage src={slides[currentIndex]} onClick={handleImageClick} />}
			</div>

			{slides && <div style={{ display: 'flex', justifyContent: 'center' }}>
				{slides.map((_, index) => (
					<div
						key={index}
						style={{ margin: '0 3px', cursor: 'pointer', fontSize: '20px ' }}
						onClick={() => handleDotClick(index)}
					>
						&#x25CF;
					</div>
				))}
			</div>
			}

			{slides && <Modal
				open={showModal}
				onClose={() => setShowModal(false)}
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<>
					<img
						style={{ maxWidth: '100%', maxHeight: '85%', minWidth: '45%' }}
						src={slides[currentIndex]} />

					<Button
						sx={{position: 'absolute', bottom: '10%'}}
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
