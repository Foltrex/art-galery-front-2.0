import { Divider, Grid, ImageList, Paper, Tooltip, Typography } from '@mui/material';
import { Container } from '@mui/system';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGetAccountById } from '../../api/AccountApi';
import { useGetAllArtsByArtistId } from '../../api/ArtApi';
import { useGetArtistById } from '../../api/ArtistApi';
import Man from '../../assets/images/man.png';
import ArtItem from '../../components/ui/ArtItem';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import ScrollTop from '../../components/ui/ScrollTop';

interface IArtistProfileProps {
}

const ArtistProfile: React.FunctionComponent<IArtistProfileProps> = () => {
	const { id: artistId } = useParams();

	const {data: infinteData, isSuccess, fetchNextPage } = useGetAllArtsByArtistId(artistId);
	const lastPage = infinteData?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const {data: artist} = useGetArtistById(artistId);
	const {data: artistAccount} = useGetAccountById(artist?.accountId);

	return (
		<Container sx={{position: 'relative'}}>
			<Grid container justifyContent='center' alignItems='center' spacing={12} my={2}>
				<Grid item xs={6}>
					<img src={Man} style={{ maxHeight: '270px', float: 'right' }} />
				</Grid>
				<Grid item xs={6}>
					<Grid container direction='row' alignItems='center' my={1}>
						<Grid item xs={4}>
							<Typography variant='h5'>Fullname</Typography>
						</Grid>
						<Grid item xs={8}>
							<Typography variant='h5' color='text.secondary' sx={{ fontWeight: 'light' }} >
								{artist?.firstname + ' ' + artist?.lastname}
							</Typography>
						</Grid>
					</Grid>

					<Grid container direction='row' alignItems='center' my={1}>
						<Grid item xs={4}>
							<Typography variant='h5'>Email</Typography>
						</Grid>
						<Grid item xs={8}>
							<Typography variant='h5' color='text.secondary' sx={{ fontWeight: 'light' }} >
								{artistAccount?.email}
							</Typography>
						</Grid>
					</Grid>

					<Grid container direction='row' alignItems='center' my={1}>
						<Grid item xs={4}>
							<Typography variant='h5'>Address</Typography>
						</Grid>
						<Grid item xs={8}>
							<Tooltip title={artist?.address?.fullName}>
								<Typography 
									variant='h5' 
									color='text.secondary' 
									sx={{ 
										fontWeight: 'light', 
										whiteSpace: 'nowrap', 
										overflow: 'hidden', 
										textOverflow: 'ellipsis' 
									}} 
								>
									{artist?.address?.fullName}
								</Typography>
							</Tooltip>
						</Grid>
					</Grid>

					<Grid container direction='row' alignItems='center' my={1}>
						<Grid item xs={4}>
							<Typography variant='h5'>Description</Typography>
						</Grid>
						<Grid item xs={8}>
							<Typography variant='h5' color='text.secondary' sx={{ fontWeight: 'light' }} >
								{artist?.description}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Divider />

			<Paper elevation={2} sx={{mt: 2, p: 1}}>
				{isSuccess &&
					<ImageList cols={3} rowHeight={400}>
						{infinteData.pages.map((page, i) => (
							page.content.map((art, j) => {
								return <ArtItem key={10 * i + j} art={art} showAuthor={false} />
							})
						))}
					</ImageList>
				}
			</Paper>

			{isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} />}

			<ScrollTop />
		</Container>
	);
};

export default ArtistProfile;
