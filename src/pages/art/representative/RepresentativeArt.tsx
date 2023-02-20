import { Button, Grid } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGetArtById } from '../../../api/ArtApi';
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from '../../../api/FileApi';
import DeleteModal from '../../../components/modal/DeleteModal';
import ImageSlider from '../../../components/ui/ImageSlider';
import { FileService } from '../../../services/FileService';
import RepresentativeArtInfo from './RepresentativeArtInfo';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import { useSaveProposal } from '../../../api/ProposalApi';
import ProposalDialog from './ProposalDialog';

interface IRepresentativeArtProps {
}

const RepresentativeArt: React.FunctionComponent<IRepresentativeArtProps> = (props) => {
	const [openProposalDialog, setOpenProposalDialog] = React.useState(false);

	const { id: artId } = useParams();
	const { data: art } = useGetArtById(artId!);
	const { data: files } = useGetAllFileInfosByArtId(artId!);

	let fileIds: string[] = [];
	if (files) {
		files.forEach(file => {
			if (file.id) {
				fileIds.push(file.id);
			}
		})
	}

	const { data: imagesData } = useGetAllFileStreamByIds(fileIds);
	const images = imagesData?.map(data => FileService.toImage(data));

	const mutationSaveProposal = useSaveProposal();


	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={6}>
				<div style={{
					width: 'auto',
					height: '380px',
					margin: '0 15px',
				}}>
					{images && images.at(0)
						? <ImageSlider slides={images} />
						: <div style={{ background: '#E8EDF0', width: '100%', height: '100%' }} />
					}
				</div>
			</Grid>
			<Grid item sm={6}>
				{ art && <RepresentativeArtInfo art={art} /> }

				<Button 
					startIcon={<AssignmentReturnedIcon />}
					variant='contained' 
					sx={{ borderRadius: 8, mt: 25, left: '50%', transform: 'translate(-50%, -50%)' }}
					onClick={() => setOpenProposalDialog(true)}
				>
					Propose
				</Button>
			</Grid>

			{art && <ProposalDialog 
				art={art}
				open={openProposalDialog} 
				onClose={() => setOpenProposalDialog(false)} />}
		</Grid>
	);
};

export default RepresentativeArt;
