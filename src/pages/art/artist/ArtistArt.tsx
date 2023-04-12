import { Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { RefObject, useState } from "react";
import ArtistArtForm from './AristArtForm';
import ArtistArtInfo from './ArtistArtInfo';
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds, useDeleteFile, useGetAllEntityFilesByEntityId } from "../../../api/FileApi";
import DeleteModal from "../../../components/modal/DeleteModal";
import ImageSlider from "../../../components/ui/ImageSlider";
import { FileService } from "../../../services/FileService";
import { useGetArtById, useDeleteArt, useSaveArt } from "../../../api/ArtApi";
import { Art as ArtEntity } from '../../../entities/art';
import { EntityFileTypeEnum } from "../../../entities/enums/EntityFileTypeEnum";
import { EntityFile } from "../../../entities/entityFile";


const Art = () => {
	const navigate = useNavigate();

	const [editingMode, setEditingMode] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [mainImageNumber, setMainImageNumber] = useState<number>();

	const { id: artId } = useParams();
	const { data: art } = useGetArtById(artId!);

	const {data: fileEntities} = useGetAllEntityFilesByEntityId(art?.id);
	let fileIds: string[] = [];
	if (fileEntities) {
		fileEntities.forEach(fileEntity => {
			if (fileEntity.id && fileEntity.type === EntityFileTypeEnum.ORIGINAL) {
				fileIds.push(fileEntity.id);
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
			const file = fileEntities?.at(index);
			await mutationDeleteFile.mutateAsync(file?.id);
		} catch (e) {
			console.log(e);
		}
	}

	const mutationSaveArt = useSaveArt();

	// const useUpdateFile

	const handleSubmit = async (art: ArtEntity) => {
		await mutationSaveArt.mutateAsync(art);
		// const promises = fileEntities?.map(async (file, index) => {
		// 	var fileEntity: EntityFile = await FileService.toEntityFile(artId!, file);
		// 	if (index === mainImageNumber) {
		// 		fileEntity.isPrimary = true;
		// 	} else if (!mainImageNumber && index === 0) {
		// 		fileEntity.isPrimary = true;
		// 	} else {
		// 		 fileEntity.isPrimary = false;
		// 	}
		// 	await mutationSaveImage.mutateAsync(fileEntity);
		// })
		// await Promise.all(promises);
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
						? <ImageSlider slides={images} onDelete={onDeleteFile} setMainImageNumber={setMainImageNumber} />
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