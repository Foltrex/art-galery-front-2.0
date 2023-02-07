import { Box, Button, Container, Divider, IconButton, ImageList, Paper } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import { Art } from '../../entities/art';
import ArtItem from './ArtItem';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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

interface IArtsProps {
}

const Arts: React.FunctionComponent<IArtsProps> = (props) => {
	const artUploadingInput = useRef<HTMLInputElement>(null);

	const token = TokenService.decode(AuthService.getToken());
	const { data } = useGetAllArtsByAccountId(token.id);
	console.log(data)

	const arts: Art[] = [
		{
			id: '1',
			name: 'First',
			data: [f, s, t],
			// add latter
			description: 'asdf'
		},
		{
			id: '2',
			name: 'Second',
			data: [s, t, fo],
			// add latter
			description: 'asdf'
		},
		{
			id: '3',
			name: 'Third',
			data: [t, fo, fi],
			// add latter
			description: 'asdf'
		},
		{
			id: '4',
			name: 'Fourth',
			data: [fo, fi, si],
			// add latter
			description: 'asdf'
		},
		{
			id: '5',
			name: 'Fifth',
			data: [fi, si, se],
			// add latter
			description: 'asdf'
		},
		{
			id: '6',
			name: 'Sixth',
			data: [si, se, f],
			// add latter
			description: 'asdf'
		},
		{
			id: '7',
			name: 'Seventh',
			data: [se, f, s],
			// add latter
			description: 'asdf'
		}
	];


	return (
		<Container>
			<Paper elevation={1} sx={{ padding: '10px' }}>
				<Box
					sx={{display: 'flex', gap: '20px', justifyContent: 'space-between', px: 2, pt: 2 }}
				>
					<SearchBar sx={{ flexGrow: 1, width: 300 }}/>
					<Button 
						variant='outlined'
						aria-label='Add art to collection' 
						startIcon={<AddPhotoAlternateIcon />}
						onClick={() => artUploadingInput.current?.click()}
					>
						Upload
					</Button>
					<input type='file' ref={artUploadingInput} style={{display: 'none'}} />
				</Box>
				<Divider sx={{my: 3}} />
				<ImageList
					gap={12}
					cols={3}
					sx={{ width: 'auto', height: 850, objectFit: 'cover' }}
				>
					{arts.map((art, index) => (
						<ArtItem key={index} art={art} />
					))}
				</ImageList>
			</Paper>
		</Container>
	);
};

export default Arts;
