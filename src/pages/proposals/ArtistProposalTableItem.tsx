import { Button, Stack, TableCell, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import { useSaveProposal } from '../../api/ProposalApi';
import LetterAvatar from '../../components/ui/LetterAvatar';
import { Proposal } from '../../entities/proposal';

interface IArtistTableItemProps {
	proposal: Proposal;
	onViewDetailsClick: (proposal: Proposal) => void;
}

const ArtistTableItem: React.FunctionComponent<IArtistTableItemProps> = ({ proposal, onViewDetailsClick }) => {
	console.log(proposal)
	const [proposalObj, setProposal] = React.useState(proposal);

	const { price, currency, art, organization, artistConfirmation } = proposal;

	const mutationSaveProposal = useSaveProposal();

	const onSaveProposal = async (proposal: Proposal) => {
		try {
			const { data } = await mutationSaveProposal.mutateAsync(proposal);
			setProposal(data);
		} catch (e) {
			console.log(e);
		}
	}

	// TODO: add art info creation based on this proposal
	const handleApproveClick = () => {
		onSaveProposal({...proposalObj, artistConfirmation: true});
	}

	const handleRejectClick = () => {
		onSaveProposal({...proposalObj, artistConfirmation: false});
	}

	if (artistConfirmation !== null) {

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
				<TableCell align='center'>
						{artistConfirmation
							? (
								<Typography color='success' fontSize={15}>
									✓ Approved
								</Typography>
							) : (
								<Typography color='error' fontSize={15}>
									✕ Rejected
								</Typography>
							)
						}
				</TableCell>
				<TableCell align='center'>
					<Button size='small' onClick={() => onViewDetailsClick(proposal)}>
						View details
					</Button>
				</TableCell>
			</TableRow>
		);
	} else {

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
						<Button
							variant='contained'
							sx={{ borderRadius: 8 }}
							onClick={handleApproveClick}
						>
							Approve
						</Button>
						<Button
							variant='outlined'
							sx={{ borderRadius: 8 }}
							onClick={handleRejectClick}
						>
							Reject
						</Button>
					</Stack>
				</TableCell>
			</TableRow>
		);

	}
};

export default ArtistTableItem;