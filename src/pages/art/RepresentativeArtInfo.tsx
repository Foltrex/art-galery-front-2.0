import { Box, Typography, IconButton, Divider, Stack, Grid } from '@mui/material';
import * as React from 'react';
import art from './ArtistArt';
import { Art } from '../../entities/art';

interface IRepresentativeArtInfoProps {
	art: Art;
}

const RepresentativeArtInfo: React.FunctionComponent<IRepresentativeArtInfoProps> = ({art}) => {
	return (
		<>
			<Typography sx={{ fontSize: '2em' }}>
				{art.name}
			</Typography>
			<Divider sx={{ my: 1 }} />
			<Stack spacing={2} sx={{ marginTop: 4 }}>
				<Grid container>
					<Grid item sm={4}>
						<strong>
							Description
						</strong>
					</Grid>
					<Grid item sm={8}>
						{art.description}
					</Grid>
				</Grid>
			</Stack>
		</>
	);
};

export default RepresentativeArtInfo;
