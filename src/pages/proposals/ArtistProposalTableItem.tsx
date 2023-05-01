import {Button, Stack, TableCell, TableRow, Typography} from '@mui/material';
import * as React from 'react';
import LetterAvatar from '../../components/ui/LetterAvatar';
import {Proposal} from '../../entities/proposal';
import {Account} from "../../entities/account";

interface IArtistTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
	onArtistRejectProposalButtonClick: (proposal: Proposal) => void;
	onArtistApproveProposalButtonClick: (proposal: Proposal) => void;
}

const ArtistTableItem: React.FunctionComponent<IArtistTableItemProps> = ({ 
	proposal, 
	onViewDetailsClick, 
	onArtistApproveProposalButtonClick,
	onArtistRejectProposalButtonClick
}) => {
	const { 
		price, 
		currency, 
		art, 
		artist,
		organizationName,
		artistConfirmation,
		organizationConfirmation
	} = proposal;

	if (artistConfirmation !== null && organizationConfirmation !== null) {
		return (
			<TableRow>
				<TableCell align='center' sx={{ width: 10 }}>
					<LetterAvatar account={
						/*@ts-ignore*/
						({firstName: organizationName, lastName: '', metadata: []}) as Account
					} />
				</TableCell>
				<TableCell align='left'>
					<Stack direction='column'>
						<strong>{organizationName}</strong>
						{organizationName} propose you {price} {currency.label} for painting {art.name}
					</Stack>
				</TableCell>
				<TableCell align='left'>
					<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
						View details
					</Button>
				</TableCell>
				<TableCell align='center'>
						{artistConfirmation
							? (
								<Typography color='green' fontSize={15}>
									✓ Approved
								</Typography>
							) : (
								<Typography color='red' fontSize={15}>
									✕ Rejected
								</Typography>
							)
						}
				</TableCell>
			</TableRow>
		);
	} else if (artistConfirmation === null) {
		return (
			<TableRow>
				<TableCell align='center' sx={{ width: 10 }}>
					<LetterAvatar account={
						/*@ts-ignore*/
						({firstName: organizationName, lastName: '', metadata: []}) as Account
					} />
				</TableCell>
				<TableCell align='left'>
					<Stack direction='column'>
						<strong>{organizationName}</strong>
						{organizationName} propose you {price} {currency.label} for painting {art.name}
					</Stack>
				</TableCell>
				<TableCell align='left'>
					<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
						View details
					</Button>
				</TableCell>
				<TableCell align='center' sx={{ width: 50 }}>
					<Stack
						direction='row'
						spacing={2}
						alignItems='center'
						justifyContent='center'
					>
						<Button
							variant='contained'
							sx={{ borderRadius: 8 }}
							onClick={() => onArtistApproveProposalButtonClick(proposal)}
						>
							Approve
						</Button>
						<Button
							variant='outlined'
							sx={{ borderRadius: 8 }}
							onClick={() => onArtistRejectProposalButtonClick(proposal)}
						>
							Reject
						</Button>
					</Stack>
				</TableCell>
			</TableRow>
		);
	} else {
		return (
			<TableRow>
			<TableCell align='center' sx={{ width: 10 }}>
				<LetterAvatar account={artist} />
			</TableCell>
			<TableCell align='left'>
				<Stack direction='column'>
					<strong>{artist.firstName} {artist.lastName}</strong>
					You propose {artist.firstName} {artist.lastName} {price} {currency.label} for painting {art.name}
				</Stack>
			</TableCell>

			<TableCell />

			<TableCell align='left'>
				<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
					View details
				</Button>
			</TableCell>
		</TableRow>
		);
	}
};

export default ArtistTableItem;