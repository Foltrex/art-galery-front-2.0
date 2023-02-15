import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, Grid, IconButton, InputBase, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteArt, useGetArtById, useSaveArt } from "../../api/ArtApi";
import ImageSlider from "../../components/ui/ImageSlider";
import EditIcon from '@mui/icons-material/Edit';

import { ChangeEvent, useRef, useState } from "react";
import { useDeleteFile, useGetAllFileInfosByArtId, useGetAllFileStreamByIds, useSaveFile } from "../../api/FileApi";
import DeleteModal from "../../components/modal/DeleteModal";
import { FileService } from "../../services/FileService";
import ArtForm from './ArtForm';
import { Art as ArtEntity } from '../../entities/art';


const Art = () => {
	const navigate = useNavigate();

	const fileInput = useRef<HTMLInputElement>(null);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
 
	const { id: artId } = useParams();

	const { data: art } = useGetArtById(artId!);

	const { data: files } = useGetAllFileInfosByArtId(artId!);

	let fileIds: string[] = [];
	if (files) {
		files.forEach(file => {
			if (file.id) {
				fileIds.push(file.id);
			}
		})
	}

	const { data: imagesData } = useGetAllFileStreamByIds(fileIds);
	const images = imagesData?.map(data => FileService.toImage(data));

	const mutationSaveImage = useSaveFile();

	const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		try {
			const files = event.target.files!;
			const file = await FileService.toFile(artId!, files[0]);
			await mutationSaveImage.mutateAsync(file);
		} catch (e) {
			// TODO: add push events
			console.log(e);
		}
	}

	const mutationDeleteArt = useDeleteArt();

	const onDelete = async () => {
		try {
			// !!! navigate have to be first becouse of artId absence param
			navigate('/arts')
			await mutationDeleteArt.mutateAsync(art?.id);
		} catch (e) {
			console.log(e);
		}
	}

	const mutationDeleteFile = useDeleteFile();

	const onDeleteFile = async (index: number) => {
		try {
			const file = files?.at(index);
			await mutationDeleteFile.mutateAsync(file?.id);
		} catch (e) {
			console.log(e);
		}
	}

	const mutationSaveArt = useSaveArt();

	const handleSubmit = async (art: ArtEntity) => {
		await mutationSaveArt.mutateAsync(art);
		setIsEditing(false);
	}

	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={6}>
				<div style={{
					width: 'auto',
					height: '380px',
					margin: '0 15px',
				}}>
					{images && images.at(0)
						?	<ImageSlider slides={images} onDelete={onDeleteFile} />
						:	<div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
					}
				</div>
			</Grid>
			<Grid item sm={6}>
				{isEditing
					?  	<ArtForm 
						art={art!} 
						onSubmit={handleSubmit}  />
					: 	<>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant='h4'>
									{art?.name}
								</Typography>
								<Box>
									<IconButton onClick={() => setIsEditing(true)}>
										<EditIcon />
									</IconButton>
									<IconButton onClick={() => fileInput.current?.click()}>
										<AddPhotoAlternateIcon color='primary' />
										<input
											type='file'
											style={{ display: 'none' }}
											ref={fileInput}
											onChange={handleFileInputChange} />
									</IconButton>
									<IconButton onClick={() => setOpenDeleteModal(true)}>
										<DeleteIcon color='error' />
									</IconButton>
								</Box>
							</Box>
							<Divider sx={{ my: 1 }} />
							<Stack spacing={2} sx={{ marginTop: 4 }}>
								<Grid container>
									<Grid item sm={4}><strong>Description</strong></Grid>
									<Grid item sm={8}>
										{art?.description}
									</Grid>
								</Grid>
							</Stack>
			
							<DeleteModal
								open={openDeleteModal}
								onClose={() => setOpenDeleteModal(false)}
								onDelete={onDelete} />
						</>
				}
			</Grid>
		</Grid>

	);
}

export default Art;