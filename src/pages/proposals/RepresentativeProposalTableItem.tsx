import { Delete } from '@mui/icons-material';
import { Button, IconButton, Stack, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import { useDeleteProposal } from '../../api/ProposalApi';
import LetterAvatar from '../../components/ui/LetterAvatar';
import { Proposal } from '../../entities/proposal';
import { TokenService } from '../../services/TokenService';

interface IRepresentativeTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
}

const RepresentativeTableItem: React.FunctionComponent<IRepresentativeTableItemProps> = ({ proposal, onViewDetailsClick }) => {
	const mutationDeleteProposal = useDeleteProposal();

	const onDeleteProposal = async () => {
		try {
			await mutationDeleteProposal.mutateAsync(proposal.id);
		} catch (e) {
			console.log(e)
		}
	}
	const { artist, price, currency, art } = proposal;
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
				<IconButton onClick={onDeleteProposal}>
					<Delete />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};

export default RepresentativeTableItem;

