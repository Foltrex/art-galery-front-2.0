import { Box, Button, Container, Divider, IconButton, ImageList, Paper } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import { Art } from '../../entities/art';
import ArtItem from './ArtItem';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';

import f from './images/1.jpg';
import s from './images/2.jpg';
import t from './images/3.jpg';
import fo from './images/4.jpg';
import fi from './images/5.jpg';
import si from './images/6.jpeg';
import se from './images/7.webp';
import SearchBar from '../../components/ui/SearchBar';
import { useRef } from 'react';
import { useGetAllArtsByAccountId } from '../../api/ArtApi';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import { useNavigate } from 'react-router-dom';
import { useGetAllFirstFileInfosByArtIds } from '../../api/FileApi';
import { IPage } from '../../hooks/react-query';

interface IArtsProps {
}

const Arts: React.FunctionComponent<IArtsProps> = (props) => {
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
					<IconButton onClick={() => navigate('/arts/-1')}>
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
							console.log(art);
							return <ArtItem key={10 * i + j} art={art} />
						})
					))}
				</ImageList>
			</Paper>
		</Container>
	);
};

export default Arts;
