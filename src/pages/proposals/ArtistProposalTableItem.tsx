import { Button, Stack, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import LetterAvatar from '../../components/ui/LetterAvatar';
import { Proposal } from '../../entities/proposal';

interface IArtistTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
}

const ArtistTableItem: React.FunctionComponent<IArtistTableItemProps> = ({ proposal, onViewDetailsClick }) => {
	console.log(proposal)

	const { price, currency, art, organization } = proposal;
	return (
		<TableRow>
			<TableCell align='center' sx={{ width: 10 }}>
				<LetterAvatar name={organization.name} />
			</TableCell>
			<TableCell align='left'>
				<Stack direction='column'>
					<strong>{organization.name}</strong>
					{organization.name} propose you {price} {currency.label} for painting {art.name}
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
					<Button variant='contained' sx={{ borderRadius: 8 }}>
						Approve
					</Button>
					<Button variant='outlined' sx={{ borderRadius: 8 }}>
						Reject
					</Button>
				</Stack>
			</TableCell>
		</TableRow>
	);
};

export default ArtistTableItem;