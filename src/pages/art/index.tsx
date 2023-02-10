import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetArtById } from "../../api/ArtApi";
import ImageSlider from "../../components/ui/ImageSlider";


import { ChangeEvent, useRef, useState } from "react";
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds, useSaveFile } from "../../api/FileApi";
import DeleteModal from "../../components/modal/DeleteModal";
import { FileService } from "../../services/FileService";


const Art = () => {
	const fileInput = useRef<HTMLInputElement>(null);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const { id: artId } = useParams();

	const { data: art } = useGetArtById(artId!);

	const { data: files } = useGetAllFileInfosByArtId(artId!);
	console.log(files)

	let fileIds: string[] = [];
	if (files) {
		files.forEach(file => {
			if (file.id) {
				fileIds.push(file.id);
			}
		})
	}

	const { data: images } = useGetAllFileStreamByIds(fileIds);

	const mutationSaveImage = useSaveFile();

	// const onSaveImage = async ()
	const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		try {
			const files = event.target.files!;
			const file = await FileService.toFile(artId!, files[0]);
			await mutationSaveImage.mutateAsync(file)
		} catch (e) {
			// TODO: add push events
			console.log(e);
		}
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
					<ImageSlider slides={images} />
				</div>
			</Grid>
			<Grid item sm={6}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Typography variant='h4'>
						{art?.name}
					</Typography>
					<Box>
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
					onDelete={() => console.log('Entity deleted')} />
			</Grid>
		</Grid>

	);
}

export default Art;