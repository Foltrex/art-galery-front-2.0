import {Box, Divider, Grid, IconButton, Stack, Typography} from '@mui/material';
import * as React from 'react';
import {Art} from '../../../entities/art';
import ArtExhibitionHistory from '../ArtExhibitionHistory';
import {History} from '@mui/icons-material';

interface IRepresentativeArtInfoProps {
	art: Art;
}

const RepresentativeArtInfo: React.FunctionComponent<IRepresentativeArtInfoProps> = ({art}) => {
	const [showArtExhibitionHistory, setShowArtExhibitionHistory] = React.useState(false);

	return (
		<>
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography sx={{ fontSize: '2em' }}>
					{art.name}
				</Typography>

				<IconButton onClick={() => setShowArtExhibitionHistory(true)}>
					<History />
				</IconButton>
			</Box>
			<Divider sx={{ my: 1 }} />
			<Stack spacing={2} sx={{ marginTop: 4 }}>
				<Grid container>
					<Grid item sm={4}>
						<strong>Description</strong>
					</Grid>
					<Grid item sm={8}>
						{art.description}
					</Grid>
				</Grid>
				<Grid container>
					<Grid item sm={4}>
						<strong>Arist</strong>
					</Grid>
					<Grid item sm={8}>
						{art.artist.firstname
							? `${art.artist.firstname} ${art.artist.lastname}`
							: 'Unknown'
						}
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

export default RepresentativeArtInfo;
