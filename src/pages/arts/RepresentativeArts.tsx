import { Checkbox, Container, Divider, FormControlLabel, FormGroup, Paper } from '@mui/material';
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
	const [isExhibited, setIsExhibited] = React.useState(true);

	const token = TokenService.decode(AuthService.getToken());
	const { data: infinteData, isSuccess, fetchNextPage } = useGetAllArtsByAccountIdAndSearchText(token.id, {
		name: searchText,
		isExhibited: isExhibited
	});

	const lastPage = infinteData?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const handleSearch = (searchText: string) => {
		setSearchText(searchText);
	}

	const handleExhibitedCheckboxClick = () => {
		setIsExhibited(!isExhibited);
	}

	return (
		<Container sx={{ position: 'relative' }}>
			<Paper elevation={1} sx={{ padding: '10px', minHeight: 400 }}>
				<SearchBar onSearch={handleSearch} />

				<FormGroup sx={{ ml: 3, my: 1 }}>
					<FormControlLabel 
						control={
							<Checkbox 
								checked={isExhibited}
								onChange={handleExhibitedCheckboxClick}
							/>
						} 
						label='Exhibited'
					/>
				</FormGroup>
				
				<Divider sx={{ my: 1 }} />

				{isSuccess && <InfiniteArtList infinteData={infinteData} />}
			</Paper>

			{isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} />}
			<ScrollTop />
		</Container>
	);
};

export default RepresentativeArts;
