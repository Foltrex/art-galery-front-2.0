import {Add} from '@mui/icons-material';
import {Box, Grid, IconButton} from '@mui/material';
import {ChangeEvent, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSaveArt} from '../../../api/ArtApi';
import {useUploadFile} from '../../../api/FileApi';
import ImageSlider from '../../../components/ui/ImageSlider';
import {Art} from '../../../entities/art';
import {EntityFile} from '../../../entities/entityFile';
import {FileService} from '../../../services/FileService';
import ArtForm from './AristArtForm';
import Bubble from "../../../components/bubble/Bubble";
import {getErrorMessage} from "../../../util/PrepareDataUtil";

const ArtCreation = () => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [images, setImages] = useState<string[]>([]);
	const [mainImageNumber, setMainImageNumber] = useState<number>();

	const deleteImage = (index:number) => {
		images.splice(index, 1)
		const newImages = [...images];
		setImages(newImages);
	}

	const navigate = useNavigate();

	const mutationSaveArt = useSaveArt();
	const mutationSaveImage = useUploadFile();

	const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const fileList = e.target.files!;

		const file = fileList[0];
		setFiles([...files, file]);

		const image = await FileService.toBase64fromBlob(file);
		setImages([...images, image]);
	}

	const handleSubmit = async (art: Art) => {
		let infoId:number|undefined;
		await mutationSaveArt.mutateAsync(art).then(response => {
			infoId = Bubble.info("Data prepared, uploading images...");


			const promises = files.map(async (file, index) => {
				var fileEntity: EntityFile = await FileService.toEntityFile(response.data.id!, file);
				if (index === mainImageNumber) {
					fileEntity.isPrimary = true;
				} else if (!mainImageNumber && index === 0) {
					fileEntity.isPrimary = true;
				} else {
					fileEntity.isPrimary = false;
				}
				await mutationSaveImage.mutateAsync(fileEntity);
			})
			return Promise.all(promises).then(() => {
				if(infoId !== undefined) {
					Bubble.close(infoId);
				}
				Bubble.success("Art created successfully");
				navigate(`/gallery/`);
			}).catch(e => {
				Bubble.error({message: "Failed to upload image(s). Error is " + getErrorMessage(e), duration: 999999});
			});
		}).catch(e => {
			Bubble.error({message: "Failed to create new art, error is " + getErrorMessage(e), duration: 999999});
		});

	}

	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={7}>
				<div style={{
					width: 'auto',
					height: '380px',
					margin: '0 15px',
				}}>
					{images && images.length > 0
						? <ImageSlider
							onDelete={deleteImage}
							slides={images} 
							handleMakeMainClick={setMainImageNumber}
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
									<Add fontSize='large' />
								</IconButton>
						</Box>
					}
					<input
						type='file'
						ref={fileInput}
						onChange={handleFileInputChange}
						style={{ display: 'none' }}
					/>
				</div>
			</Grid>
			<Grid item sm={5}>
				<ArtForm
					art={{} as Art}
					onSubmit={handleSubmit}
				/>
			</Grid>
		</Grid>
	);
};

export default ArtCreation;
