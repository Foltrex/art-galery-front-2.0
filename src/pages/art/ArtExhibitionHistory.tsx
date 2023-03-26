import {Close} from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';
import * as React from 'react';
import {useGetArtInfosByArtId} from '../../api/ArtInfoApi';
import LetterAvatar from '../../components/ui/LetterAvatar';
import {Art} from '../../entities/art';

interface IArtExhibitionHistoryProps {
	art: Art;
	open: boolean;
	onClose: () => void;
}

const ArtExhibitionHistory: React.FunctionComponent<IArtExhibitionHistoryProps> = ({ art, open, onClose }) => {
	const { data: artInfosHistory } = useGetArtInfosByArtId(art.id);

	const renderArtHistory = () => {
		return artInfosHistory && artInfosHistory.length > 0
			? artInfosHistory.map(item => (
				<ListItem key={item.id}>
					<ListItemAvatar>
						<LetterAvatar name={item.facility.name} />
					</ListItemAvatar>
					<ListItemText
						primary={
							<Typography sx={{ fontWeight: 'bold' }}>
								{item.facility.name ?? 'Unknown'}
							</Typography>
						}
						secondary={
							<Stack>
								<Typography variant='caption'>
									{/* Exhibition period:  */}
									from {item.expositionDateStart.toString().slice(0, 10)} to {item.expositionDateEnd?.toString().slice(0, 10) ?? 'now'}
								</Typography>
								<Typography variant='caption'>
									{item.price} {item?.currency?.label}
								</Typography>
							</Stack>
						}
					/>
				</ListItem>
			))
			: 'History is empty'
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='xs'
			fullWidth
		>
			<DialogTitle>History</DialogTitle>
			<IconButton
				onClick={onClose}
				sx={{ position: 'absolute', top: 8, right: 8 }}
			>
				<Close />
			</IconButton>
			<Divider />
			<DialogContent>
				<DialogContentText>
					<List>
						{renderArtHistory()}
					</List>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default ArtExhibitionHistory;
