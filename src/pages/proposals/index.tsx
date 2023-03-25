import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import * as React from 'react';
import { useDeleteProposal, useGetProposalPageByAccountId, useSaveProposal } from '../../api/ProposalApi';
import DeleteModal from '../../components/modal/DeleteModal';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import ScrollTop from '../../components/ui/ScrollTop';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { Proposal } from '../../entities/proposal';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import ArtistProposalTableItem from './ArtistProposalTableItem';
import CounterofferModal from './CounterofferModal';
import ProposalInfo from './ProposalInfo';
import RepresentativeProposalTableItem from './RepresentativeProposalTableItem';

interface IRepresentativeProposalsProps {
}

const RepresentativeProposals: React.FunctionComponent<IRepresentativeProposalsProps> = () => {
	const accountType = TokenService.getCurrentAccountType();

	const [openProposalInfoModal, setOpenProposalInfoModal] = React.useState(false);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [openCounterOfferModal, setOpenCounterOfferModal] = React.useState(false);
	const [proposal, setProposal] = React.useState<Proposal>();

	const token = TokenService.decode(AuthService.getToken());
	const { data, isSuccess, fetchNextPage } = useGetProposalPageByAccountId(token.id);

	const lastPage = data?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const mutationDeleteProposal = useDeleteProposal();

	const onDeleteProposal = async (proposal: Proposal) => {
		try {
			await mutationDeleteProposal.mutateAsync(proposal.id);
		} catch (e) {
			console.log(e)
		}
	}

	const handleViewDetailsClick = (proposal: Proposal) => {
		setProposal(proposal);
		setOpenProposalInfoModal(true);
	}

	const handleDeleteButtonClick = (proposal: Proposal) => {
		setProposal(proposal);
		setOpenDeleteModal(true);
	}

	const handleEditButtonClick = (proposal: Proposal) => {
		onSaveProposal(proposal);
	}
	
	const handleArtistApproveProposalButtonClick = (proposal: Proposal) => {
		onSaveProposal({...proposal, artistConfirmation: true});
	}

	const handleArtistRejectProposalButtonClick = (proposal: Proposal) => {
		setProposal(proposal);
		onSaveProposal({...proposal, artistConfirmation: false});
		setOpenCounterOfferModal(true);
	}

	const handleOrganizationApproveProposalButtonClick = (proposal: Proposal) => {
		onSaveProposal({...proposal, organizationConfirmation: true});
	}

	const handleOrganizationRejectProposalButtonClick = (proposal: Proposal) => {
		setProposal(proposal);
		onSaveProposal({...proposal, organizationConfirmation: false});
		setOpenCounterOfferModal(true);
	}



	const mutationSaveProposal = useSaveProposal();

	const onSaveProposal = async (proposal: Proposal) => {
		try {
			await mutationSaveProposal.mutateAsync(proposal!);
		} catch (e) {
			console.log(e);
		}
	}

	const renderTableItem = (proposal: Proposal) => {
		switch (accountType) {
			case AccountEnum.REPRESENTATIVE: {
				return (
					<RepresentativeProposalTableItem 
						proposal={proposal} 
						onViewDetailsClick={handleViewDetailsClick}
						onOrganizationRejectProposalButtonClick={handleOrganizationRejectProposalButtonClick} 
						onOrganizationApproveProposalButtonClick={handleOrganizationApproveProposalButtonClick} 
						onDeleteButtonClick={handleDeleteButtonClick} 
					/>
				);
			}
			case AccountEnum.ARTIST: {
				return (
					<ArtistProposalTableItem
						proposal={proposal}
						onViewDetailsClick={handleViewDetailsClick} 
						onArtistRejectProposalButtonClick={handleArtistRejectProposalButtonClick} 
						onArtistApproveProposalButtonClick={handleArtistApproveProposalButtonClick} 
					/>
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
							<TableCell colSpan={5} align='left'>
								<Typography variant='h5'>
									Proposals
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.pages.map((page, i) => (
							page.content.map((proposal, j) => (
								<React.Fragment key={10 * i + j}>
									{renderTableItem(proposal)}
								</React.Fragment>
							)
						)))}
					</TableBody>
				</Table>
			</TableContainer>

			{ isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} /> }

			<ScrollTop />

			<CounterofferModal 
				open={openCounterOfferModal} 
				onClose={() => setOpenCounterOfferModal(false)} 
				proposal={proposal!}			
			/>

			<ProposalInfo
				proposal={proposal!}
				open={openProposalInfoModal} 
				onClose={() => setOpenProposalInfoModal(false)} />

			<DeleteModal 
				open={openDeleteModal} 
				onClose={() => setOpenDeleteModal(false)} 
				onDelete={() => onDeleteProposal(proposal!)} />
		</Paper>
	);
};

export default RepresentativeProposals;
