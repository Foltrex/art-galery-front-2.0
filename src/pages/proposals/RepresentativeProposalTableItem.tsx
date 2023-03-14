import { Delete } from '@mui/icons-material';
import { Button, IconButton, Stack, TableCell, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import { useDeleteProposal } from '../../api/ProposalApi';
import LetterAvatar from '../../components/ui/LetterAvatar';
import { Proposal } from '../../entities/proposal';
import { TokenService } from '../../services/TokenService';

interface IRepresentativeTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
	onDeleteButtonClick: (proposal: Proposal) => void;
}

const RepresentativeTableItem: React.FunctionComponent<IRepresentativeTableItemProps> = ({ proposal, onViewDetailsClick, onDeleteButtonClick }) => {

	const { artist, price, currency, art, artistConfirmation } = proposal;

	console.log(proposal);

	const renderIsApprovedCell = () => {
		if (artistConfirmation !== null) {
			return (
				<TableCell align='left'>
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
			);
		} else {
			return <TableCell />
		}
	}

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

			{renderIsApprovedCell()}

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
};

export default RepresentativeTableItem;

