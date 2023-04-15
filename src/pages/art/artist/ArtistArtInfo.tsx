import { History } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import * as React from 'react';
// import { useGetArtistByAccountId } from '../../../api/ArtistApi';
import { useGetAccountById } from '../../../api/AccountApi';
import { useUploadFile } from '../../../api/FileApi';
import { Art as ArtEntity } from '../../../entities/art';
import { FileService } from '../../../services/FileService';
import { useRootStore } from '../../../stores/provider/RootStoreProvider';
import ArtExhibitionHistory from '../ArtExhibitionHistory';

interface IArtInfoProps {
	art: ArtEntity;
	onEditButtonClick: () => void;
	onDeleteButtonClick: () => void;
}

const ArtInfo: React.FunctionComponent<IArtInfoProps> = ({ 
	art, 
	onEditButtonClick, 
	onDeleteButtonClick 
}) => {
	const [showArtExhibitionHistory, setShowArtExhibitionHistory] = React.useState(false);

	const fileInput = React.useRef<HTMLInputElement>(null);
	
	const mutationSaveImage = useUploadFile();
	
	const { authStore } = useRootStore();
	const account = authStore.account;
	const { data: artist } = useGetAccountById(art.artistAccountId) ?? account;

	const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const files = event.target.files!;
			const file = await FileService.toEntityFile(art.id!, files[0]);
			await mutationSaveImage.mutateAsync(file);
		} catch (e) {
			// TODO: add push events
			console.log(e);
		}
	}

	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography sx={{ fontSize: '2em' }}>
					{art.name}
				</Typography>
				<Box>
					<IconButton
						onClick={() => setShowArtExhibitionHistory(true)}
					>
						<History />
					</IconButton>
					{/* {isEditable && */
						<>
							<IconButton onClick={onEditButtonClick}>
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
							<IconButton onClick={onDeleteButtonClick}>
								<DeleteIcon color='error' />
							</IconButton>
						</>
					}
				</Box>
			</Box>
			
			<Stack spacing={2} sx={{ marginTop: 4 }}>
				<Grid container>
					<Grid item sm={4}><strong>Description</strong></Grid>
					<Grid item sm={8}>
						{art.description}
					</Grid>
				</Grid>
				<Grid container>
					<Grid item sm={4}><strong>Artist</strong></Grid>
					<Grid item sm={8}>
						{`${artist?.firstName} ${artist?.lastName}`}
					</Grid>
				</Grid>
				<Grid container>
					<Grid item sm={4}><strong>Style</strong></Grid>
					<Grid item sm={8}>
						{art.artStyles
							.map(s => s.label)
							.join(', ')
						}
					</Grid>
				</Grid>
				<Grid container>
					<Grid item sm={4}><strong>Size</strong></Grid>
					<Grid item sm={8}>
						{art.artSize.label}
					</Grid>
				</Grid>
				<Grid container>
					<Grid item sm={4}><strong>Description</strong></Grid>
					<Grid item sm={8}>
						{art.description}
					</Grid>
				</Grid>
			</Stack>

			<ArtExhibitionHistory 
				art={art}
				open={showArtExhibitionHistory} 
				onClose={() => setShowArtExhibitionHistory(false)} />
		</>
	);
};

export default ArtInfo;
