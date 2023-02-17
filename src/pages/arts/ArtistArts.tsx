import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Divider, IconButton, ImageList, Paper } from '@mui/material';
import ArtItem from './ArtItem';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import { useRef, useState } from 'react';
import { useGetAllArtsByAccountIdAndSearchText } from '../../api/ArtApi';
import ScrollTop from '../../components/ui/ScrollTop';
import InfiniteArtList from './InfiniteArtList';
import LoadMoreButton from './LoadMoreButton';

const Arts = () => {
	const navigate = useNavigate();

	const [searchText, setSearchText] = useState<string>();

	const token = TokenService.decode(AuthService.getToken());
	const { data: infinteData, isSuccess, fetchNextPage } = useGetAllArtsByAccountIdAndSearchText(token.id, {
		name: searchText
	});

	const lastPage = infinteData?.pages.at(-1);
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

				{ isSuccess && <InfiniteArtList infinteData={infinteData} /> }
			</Paper>

			{ isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} />  }
			<ScrollTop />
		</Container>
	);
};

export default Arts;
