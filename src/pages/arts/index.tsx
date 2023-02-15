import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Divider, IconButton, ImageList, Paper } from '@mui/material';
import ArtItem from './ArtItem';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import { useState } from 'react';
import { useGetAllArtsByAccountIdAndSearchText } from '../../api/ArtApi';

const Arts = () => {
	const navigate = useNavigate();

	const [searchText, setSearchText] = useState<string>();

	const token = TokenService.decode(AuthService.getToken());
	const { data: artPages, isSuccess, fetchNextPage } = useGetAllArtsByAccountIdAndSearchText(token.id, {
		name: searchText
	});

	const lastPage = artPages?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const handleSearch = (searchText: string) => {
		setSearchText(searchText);
	}
	

	return (
		<Container sx={{position: 'relative'}}>
			<Paper elevation={1} sx={{ padding: '10px', minHeight: 400 }}>
				<Box
					sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', px: 2, pt: 2 }}
				>
					<SearchBar onSearch={handleSearch} sx={{ flexGrow: 1, width: 300 }} />
					<IconButton onClick={() => navigate('/arts/new')}>
						<AddIcon fontSize='large' />
					</IconButton>
				</Box>
				<Divider sx={{ my: 3 }} />
				<ImageList
					gap={12}
					cols={3}
					rowHeight={300}
					sx={{ width: 'auto'}}
				>
					{isSuccess && artPages.pages.map((page, i) => (
						page.content.map((art, j) => {
							return <ArtItem key={10 * i + j} art={art} />
						})
					))}
				</ImageList>

			</Paper>
			
			{isNotLast &&
				<Button
					startIcon={<ArrowDownwardIcon />}
					variant='contained'
					sx={{ 
						position: 'absolute',
						bottom: '0', 
						left: '50%',
						transform: 'translate(-50%, -50%)',
						borderRadius: 8
					}}
					onClick={() => fetchNextPage()}
				>
					Load More
				</Button>
			}
		</Container>
	);
};

export default Arts;
