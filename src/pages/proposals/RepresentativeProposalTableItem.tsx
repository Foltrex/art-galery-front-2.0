import { Delete } from '@mui/icons-material';
import { Button, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import LetterAvatar from '../../components/ui/LetterAvatar';
import { Proposal } from '../../entities/proposal';

interface IRepresentativeTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
	onOrganizationRejectProposalButtonClick: (proposal: Proposal) => void;
	onOrganizationApproveProposalButtonClick: (proposal: Proposal) => void;
	onDeleteButtonClick: (proposal: Proposal) => void;
}

const RepresentativeTableItem: React.FunctionComponent<IRepresentativeTableItemProps> = ({
	proposal,
	onViewDetailsClick,
	onDeleteButtonClick,
	onOrganizationApproveProposalButtonClick,
	onOrganizationRejectProposalButtonClick
}) => {

	const {
		artist,
		price,
		currency,
		art,
		artistConfirmation,
		organizationConfirmation
	} = proposal;

	if (artistConfirmation !== null && organizationConfirmation !== null) {
		return (
			<TableRow>
				<TableCell align='center' sx={{ width: 10 }}>
					<LetterAvatar name={artist.firstname} />
				</TableCell>
				<TableCell align='left'>
					<Stack direction='column'>
						<strong>{artist.firstname} {artist.lastname}</strong>
						You propose {artist.firstname} {artist.lastname} {price} {currency.label} for painting {art.name}
					</Stack>
				</TableCell>
				<TableCell align='left'>
					{artistConfirmation && organizationConfirmation
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
				<TableCell align='left'>
					<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
						View details
					</Button>
				</TableCell>
				<TableCell align='center' sx={{ width: 50 }}>
					<IconButton onClick={() => onDeleteButtonClick(proposal)}>
						<Delete />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	} else if (organizationConfirmation === null) {
		return (
			<TableRow>
				<TableCell align='center' sx={{ width: 10 }}>
					<LetterAvatar name={artist.firstname} />
				</TableCell>
				<TableCell align='left'>
					<Stack direction='column'>
						<strong>{artist.firstname} {artist.lastname}</strong>
						You propose {artist.firstname} {artist.lastname} {price} {currency.label} for painting {art.name}
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
							onClick={() => onOrganizationApproveProposalButtonClick(proposal)}
						>
							Approve
						</Button>
						<Button
							variant='outlined'
							sx={{ borderRadius: 8 }}
							onClick={() => onOrganizationRejectProposalButtonClick(proposal)}
						>
							Reject
						</Button>
					</Stack>
				</TableCell>
				
				<TableCell align='center' sx={{ width: 50 }}>
					<IconButton onClick={() => onDeleteButtonClick(proposal)}>
						<Delete />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	} else {
		return (
			<TableRow>
				<TableCell align='center' sx={{ width: 10 }}>
					<LetterAvatar name={artist.firstname} />
				</TableCell>
				<TableCell align='left'>
					<Stack direction='column'>
						<strong>{artist.firstname} {artist.lastname}</strong>
						You propose {artist.firstname} {artist.lastname} {price} {currency.label} for painting {art.name}
					</Stack>
				</TableCell>

				<TableCell />

				<TableCell align='left'>
					<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
						View details
					</Button>
				</TableCell>
				<TableCell align='center' sx={{ width: 50 }}>
					<IconButton onClick={() => onDeleteButtonClick(proposal)}>
						<Delete />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
};

export default RepresentativeTableItem;

