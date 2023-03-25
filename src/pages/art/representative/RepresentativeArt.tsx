import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import { Button, Grid } from '@mui/material';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGetArtById } from '../../../api/ArtApi';
import { useGetLastArtInfoByArtId } from '../../../api/ArtInfoApi';
import { useGetAllFileInfosByArtId, useGetAllFileStreamByIds } from '../../../api/FileApi';
import { useSaveProposal } from '../../../api/ProposalApi';
import ImageSlider from '../../../components/ui/ImageSlider';
import ProposalDialog from '../../../components/ui/ProposalDialog';
import { FileService } from '../../../services/FileService';
import RepresentativeArtInfo from './RepresentativeArtInfo';

interface IRepresentativeArtProps {
}

const RepresentativeArt: React.FunctionComponent<IRepresentativeArtProps> = () => {
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

	const { data: lastArtInfo } = useGetLastArtInfoByArtId(artId);

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

				{!lastArtInfo &&
					<Button 
						startIcon={<AssignmentReturnedIcon />}
						variant='contained' 
						sx={{ borderRadius: 8, mt: 25, left: '50%', transform: 'translate(-50%, -50%)' }}
						onClick={() => setOpenProposalDialog(true)}
					>
						Propose
					</Button>
				} 
			</Grid>

			{art && <ProposalDialog 
				art={art}
				open={openProposalDialog} 
				onClose={() => setOpenProposalDialog(false)} />}
		</Grid>
	);
};

export default RepresentativeArt;
