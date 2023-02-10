import AddIcon from '@mui/icons-material/Add';
import { Box, Container, Divider, IconButton, ImageList, Paper } from '@mui/material';
import ArtItem from './ArtItem';

import { useNavigate } from 'react-router-dom';
import { useGetAllArtsByAccountId } from '../../api/ArtApi';
import SearchBar from '../../components/ui/SearchBar';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';

const Arts = () => {
	const navigate = useNavigate();

	const token = TokenService.decode(AuthService.getToken());
	const { data: artPages, isSuccess } = useGetAllArtsByAccountId(token.id);

	const pages = artPages?.pages;

	let artIds: string[] = [];
	if (pages) {
		artIds = pages.flatMap(page => (
			page.content.map(art => art.id!)
		));
	}
	// const { data: files } = useGetAllFirstFileInfosByArtIds(artIds);
	// console.log(files);

	// const { data } = useGetAllFirstFileInfosByArtIds();

	return (
		<Container>
			<Paper elevation={1} sx={{ padding: '10px' }}>
				<Box
					sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', px: 2, pt: 2 }}
				>
					<SearchBar sx={{ flexGrow: 1, width: 300 }} />
					<IconButton onClick={() => navigate('/arts/new')}>
						<AddIcon fontSize='large' />
					</IconButton>
				</Box>
				<Divider sx={{ my: 3 }} />
				<ImageList
					gap={12}
					cols={3}
					sx={{ width: 'auto', height: 850, objectFit: 'cover' }}
				>
					{isSuccess && artPages.pages.map((page, i) => (
						page.content.map((art, j) => {
							return <ArtItem key={10 * i + j} art={art} />
						})
					))}
				</ImageList>
			</Paper>
		</Container>
	);
};

export default Arts;
