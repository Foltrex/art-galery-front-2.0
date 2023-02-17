import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSaveArt } from '../../api/ArtApi';
import { Art } from '../../entities/art';
import ArtForm from './AristArtForm';

const ArtCreation = () => {
	const navigate = useNavigate();;

	const mutationSaveArt = useSaveArt();

	const handleSubmit = async (art: Art) => {
		const response = await mutationSaveArt.mutateAsync(art);
		const { data: persistedArt } = response;
		const { id } = persistedArt;
		navigate(`/arts/${id}`);
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
					
					<div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
				</div>
			</Grid>
			<Grid item sm={6}>
				<ArtForm 
					art={{} as Art} 
					onSubmit={handleSubmit} />
			</Grid>
		</Grid>
	);
};

export default ArtCreation;
