import {Close} from '@mui/icons-material';
import {Dialog, DialogContent, DialogTitle, Grid, IconButton, Skeleton, Stack} from '@mui/material';
import {Box} from '@mui/system';
import * as React from 'react';
import ImageSlider from '../../components/ui/ImageSlider';
import {Proposal} from '../../entities/proposal';
import {FileService} from '../../services/FileService';

interface IProposalInfoProps {
	proposal: Proposal;
	open: boolean;
	onClose: () => void;
}

const ProposalInfo: React.FunctionComponent<IProposalInfoProps> = ({ proposal, open, onClose }) => {
	const art = proposal?.art;
	//@todo load images data from art entity
	const { data: imagesData } = {data: []};
	const images = imagesData?.map(data => FileService.toImage(data));

	const renderContent = () => {
		return (
			<Grid container spacing={3}>
			<Grid item xs={7}>
				<Box component='div' sx={{ width: 'auto', height: 380, mb: 2 }}>
					{images && images.at(0)
						? <ImageSlider slides={images}/>
						: <div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
					}
				</Box>
			</Grid>
			<Grid item xs={5}>
				<Stack spacing={2}>
					<Stack>
						<strong>Art Name</strong>
						{art?.name}
					</Stack>
					<Stack>
						{/* <strong>Artist</strong>
						{art?.artist.firstname
							? `${art?.artist.firstname} ${art?.artist.lastname}`
							: 'Unknown artist'
						} */}
					</Stack>
					<Stack>
						<strong>Price</strong>
						{`${proposal.price} ${proposal.currency.label}`}
					</Stack>
					<Stack>
						<strong>Commission</strong>
						{`${proposal.commission} %`}
					</Stack>
				</Stack>
			</Grid>
		</Grid>
		);
	}

	const renderSkeleton = () => {
		return (
				<Grid container spacing={3}>
					<Grid item xs={7}>
						<Skeleton width={380} height='auto' sx={{mb: 2}} />
					</Grid>
					<Grid item xs={5}>
						<Stack spacing={2}>
							<Skeleton />
							<Skeleton />
							<Skeleton />
							<Skeleton />
						</Stack>
					</Grid>
				</Grid>
		);
	}
	
	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>
				Proposal Info

				<IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				{proposal
					? renderContent()
					: renderSkeleton()
				}
			</DialogContent>
		</Dialog>
	);
};

export default ProposalInfo;
