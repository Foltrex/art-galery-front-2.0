import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import { useGetProposalPageByAccountId } from '../../api/ProposalApi';
import ScrollTop from '../../components/ui/ScrollTop';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { Proposal } from '../../entities/proposal';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import LoadMoreButton from '../arts/LoadMoreButton';
import ArtistProposalTableItem from './ArtistProposalTableItem';
import ProposalInfo from './ProposalInfo';
import RepresentativeProposalTableItem from './RepresentativeProposalTableItem';

interface IRepresentativeProposalsProps {
}

const RepresentativeProposals: React.FunctionComponent<IRepresentativeProposalsProps> = () => {
	const accountType = TokenService.getCurrentAccountType();

	const [openProposalInfoModal, setOpenProposalInfoModal] = React.useState(false);
	const [proposal, setProposal] = React.useState<Proposal>();

	const token = TokenService.decode(AuthService.getToken());
	const { data, isSuccess, fetchNextPage } = useGetProposalPageByAccountId(token.id);

	const lastPage = data?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const handleViewDetailsClick = (proposal: Proposal) => {
		setProposal(proposal);
		setOpenProposalInfoModal(true);
	}

	const renderTableItem = (proposal: Proposal) => {
		switch (accountType) {
			case AccountEnum.REPRESENTATIVE: {
				return (
					<RepresentativeProposalTableItem 
						proposal={proposal} 
						onViewDetailsClick={handleViewDetailsClick} />
				);
			}
			case AccountEnum.ARTIST: {
				return (
					<ArtistProposalTableItem
						proposal={proposal}
						onViewDetailsClick={handleViewDetailsClick} />
				);
			}
		}
	}

	return (
		<Paper sx={{ p: 1, mt: 15, maxWidth: 1000, mx: 'auto', position: 'relative' }}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell colSpan={4} align='left'>
								<Typography variant='h5'>
									Proposals
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.pages.map((page, i) => (
							page.content.map((proposal, j) => 
								<React.Fragment key={10 * i + j}>
									{renderTableItem(proposal)}
								</React.Fragment>
							)
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{ isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} /> }

			<ScrollTop />

			<ProposalInfo
				proposal={proposal!}
				open={openProposalInfoModal} 
				onClose={() => setOpenProposalInfoModal(false)} />
		</Paper>
	);
};

export default RepresentativeProposals;
