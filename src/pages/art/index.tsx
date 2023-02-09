import { Box, Button, Container, Divider, Grid, IconButton, InputBase, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetArtById } from "../../api/ArtApi";
import ImageSlider from "../../components/ui/ImageSlider";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import f from '../arts/images/1.jpg';
import s from '../arts/images/2.jpg';
import t from '../arts/images/3.jpg';
import fo from '../arts/images/4.jpg';
import fi from '../arts/images/5.jpg';
import si from '../arts/images/6.jpeg';
import se from '../arts/images/7.webp';

import { Art as ArtEntity } from '../../entities/art';
import { PrepareDataUtil } from "../../util/PrepareDataUtil";
import { ChangeEvent, useRef, useState } from "react";
import DeleteModal from "../../components/modal/DeleteModal";
import { FileService } from "../../services/FileService";
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds, useSaveFile } from "../../api/FileApi";

// description
// artist
// name
// image
// facility where it is handing

const Art = () => {
	const fileInput = useRef<HTMLInputElement>(null);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const { id: artId } = useParams();
	console.log(artId);
	// const { data: art, isLoading } = useGetArtById(artId!);

	// const slides = [
	// 	f, s, t, fo, fi, si, se
	// ]
	// const useSaveImage()
	const { data: files } = useGetAllFileInfosByArtId(artId!);
	const { data: images } = useGetAllFileStreamByIds((files ?? []).map(file => file.id!));
	console.log(images);

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
					width: '550px',
					height: '380px',
					margin: '0 auto',
				}}>
					<ImageSlider slides={undefined} />
				</div>
			</Grid>
			<Grid item sm={6}>
				{artId && +artId !== -1
					? <>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Typography variant='h4'>
								The best painting
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
								<Grid item sm={4}><strong>Email</strong></Grid>
								<Grid item sm={8}>tonasdf@gmail.com</Grid>
							</Grid>
						</Stack>

						<DeleteModal
							open={openDeleteModal}
							onClose={() => setOpenDeleteModal(false)}
							onDelete={() => console.log('Entity deleted')} />
					</>
					: <>
						<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<InputBase placeholder='Enter art name' fullWidth />
							<IconButton>
								<SaveIcon />
							</IconButton>
						</Box>
						<Divider sx={{ my: 1 }} />
						<Stack spacing={2} sx={{ marginTop: 4 }}>
							<Grid container>
								<Grid item sm={4}><strong>Email</strong></Grid>
								<Grid item sm={8}>
									<InputBase placeholder='Enter your email' fullWidth />
								</Grid>
							</Grid>
							<Grid container>
								<Grid item sm={4}><strong>Description</strong></Grid>
								<Grid item sm={8}>
									<InputBase multiline fullWidth placeholder='Enter art description' sx={{ borderRadius: 1, borderColor: "black" }} />
								</Grid>
							</Grid>
						</Stack>
					</>
				}
			</Grid>
		</Grid>

	);
}

export default Art;