import { Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { RefObject, useState } from "react";
import ArtistArtForm from './AristArtForm';
import ArtistArtInfo from './ArtistArtInfo';
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds, useDeleteFile } from "../../../api/FileApi";
import DeleteModal from "../../../components/modal/DeleteModal";
import ImageSlider from "../../../components/ui/ImageSlider";
import { FileService } from "../../../services/FileService";
import { useGetArtById, useDeleteArt, useSaveArt } from "../../../api/ArtApi";
import { Art as ArtEntity } from '../../../entities/art';


const Art = () => {
	const navigate = useNavigate();

	const [editingMode, setEditingMode] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
		setEditingMode(false);
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
						? <ImageSlider slides={images} onDelete={onDeleteFile} />
						: <div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
					}
				</div>
			</Grid>
			<Grid item sm={6}>
				{!editingMode && art
					? <ArtistArtInfo
						art={art}
						onEditButtonClick={() => setEditingMode(true)}
						onDeleteButtonClick={() => setOpenDeleteModal(true)} />
					: <ArtistArtForm
						art={art}
						onSubmit={handleSubmit} />
				}
				<DeleteModal
					open={openDeleteModal}
					onClose={() => setOpenDeleteModal(false)}
					onDelete={onDelete} />
			</Grid>
		</Grid>

	);
}

export default Art;