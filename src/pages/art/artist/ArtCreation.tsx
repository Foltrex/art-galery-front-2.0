import { Add } from '@mui/icons-material';
import { Box, Grid, IconButton } from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaveArt } from '../../../api/ArtApi';
import { useNewSaveFile } from '../../../api/FileApi';
import ImageSlider from '../../../components/ui/ImageSlider';
import { Art } from '../../../entities/art';
import { EntityFile } from '../../../entities/entityFile';
import { FileService } from '../../../services/FileService';
import ArtForm from './AristArtForm';

const ArtCreation = () => {
	const fileInput = useRef<HTMLInputElement>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [images, setImages] = useState<string[]>([]);
	const [mainImageNumber, setMainImageNumber] = useState<number>();

	const navigate = useNavigate();

	const mutationSaveArt = useSaveArt();
	const mutationSaveImage = useNewSaveFile();

	const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const fileList = e.target.files!;

		const file = fileList[0];
		setFiles([...files, file]);

		const image = await FileService.toBase64fromBlob(file);
		setImages([...images, image]);
	}

	const handleSubmit = async (art: Art) => {
		const response = await mutationSaveArt.mutateAsync(art);
		const { data: persistedArt } = response;
		const { id: artId } = persistedArt;

		const promises = files.map(async (file, index) => {
			var fileEntity: EntityFile = await FileService.toEntityFile(artId!, file);
			if (index === mainImageNumber) {
				fileEntity.isPrimary = true;
			} else if (!mainImageNumber && index === 0) {
				fileEntity.isPrimary = true;
			} else {
				 fileEntity.isPrimary = false;
			}
			await mutationSaveImage.mutateAsync(fileEntity);
		})
		await Promise.all(promises);

		navigate(`/arts/artist/${artId}`);
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
					{files.at(0)
						? <ImageSlider 
							slides={images} 
							setMainImageNumber={setMainImageNumber}
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
