import { Container, Paper, Box, IconButton, Divider } from '@mui/material';
import * as React from 'react';
import { useGetAllArtsByAccountIdAndSearchText } from '../../api/ArtApi';
import ScrollTop from '../../components/ui/ScrollTop';
import SearchBar from '../../components/ui/SearchBar';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import InfiniteArtList from './InfiniteArtList';
import LoadMoreButton from './LoadMoreButton';

interface IRepresentativeArtsProps {
}

const RepresentativeArts: React.FunctionComponent<IRepresentativeArtsProps> = () => {
	const [searchText, setSearchText] = React.useState<string>();

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
		<Container sx={{ position: 'relative' }}>
			<Paper elevation={1} sx={{ padding: '10px', minHeight: 400 }}>
				<SearchBar onSearch={handleSearch} />
				<Divider sx={{ my: 3 }} />

				{isSuccess && <InfiniteArtList infinteData={infinteData} />}
			</Paper>

			{isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} />}
			<ScrollTop />
		</Container>
	);
};

export default RepresentativeArts;
