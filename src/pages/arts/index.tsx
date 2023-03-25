import AddIcon from '@mui/icons-material/Add';
import { Box, Checkbox, Container, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, SelectChangeEvent, Tooltip } from '@mui/material';

import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllArtsByAccountIdAndSearchText } from '../../api/ArtApi';
import ScrollTop from '../../components/ui/ScrollTop';
import SearchBar from '../../components/ui/SearchBar';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import InfiniteArtList from './InfiniteArtList';
import LoadMoreButton from '../../components/ui/LoadMoreButton';
import { AccountEnum } from '../../entities/enums/AccountEnum';

const Arts = () => {
	const navigate = useNavigate();

	const accountType = TokenService.getCurrentAccountType();

	const [searchText, setSearchText] = useState<string>();

	const searchFilters: Array<{label: string, value: string}> = [
		{label: 'Exhibited', value: 'exhibited'},
		{label: 'Free', value: 'free'},
		{label: 'All', value: 'all'}
	];
	const [searchFilter, setSearchFilter] = useState(searchFilters[0].value);

	const searchOptions:  Array<{label: string, value: string}> = [
		{label: 'Art Name', value: 'art name'},
		{label: 'Arist Name', value: 'artist name'},
		{label: 'City', value: 'city'},
		{label: 'Decription', value: 'description'}
	];
	const [searchOption, setSearchOption] = useState(searchOptions[0].value);

	const token = TokenService.decode(AuthService.getToken());
	const { data: infinteData, isSuccess, fetchNextPage } = useGetAllArtsByAccountIdAndSearchText(token.id, {
		searchText: searchText,
		searchFilter: searchFilter,
		searchOption: searchOption
	});

	const lastPage = infinteData?.pages.at(-1);
	const isNotLast = lastPage && !lastPage.last;

	const handleSearch = (searchText: string) => {
		setSearchText(searchText);
	}

	const handleChangeSearchFilter = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchFilter(e.target.value);
	}

	const handleChangeSearchOption = (e: SelectChangeEvent<string>) => {
		setSearchOption(e.target.value);
	}

	return (
		<Container sx={{position: 'relative'}}>
			<Paper elevation={1} sx={{ padding: '10px', minHeight: 400 }}>
				<Box
					sx={{ 
						display: 'flex', 
						gap: '20px', 
						justifyContent: 'space-between', 
						alignItems: 'center',
						px: 2,
						pt: 2 
					}}
				>

					<SearchBar onSearch={handleSearch} placeholder={`Search ${searchOption}...`} />

					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel id='search-option-label'>Search Option</InputLabel>
						<Select
							labelId='search-option-label'
							label='Search Option'
							value={searchOption}
							onChange={handleChangeSearchOption}
							autoWidth
							size='small'
						>
							{searchOptions.map(option => (
								<MenuItem 
									key={option.value} 
									value={option.value}
								>
									{option.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{accountType === AccountEnum.ARTIST &&
						<Tooltip title='Add New Art'>
							<IconButton onClick={() => navigate('/arts/artist/new')}>
								<AddIcon fontSize='large' />
							</IconButton>
						</Tooltip>
					}
				</Box>

				<FormGroup sx={{ px: 5, pt: 1 }}>
					<RadioGroup
						value={searchFilter}
						onChange={handleChangeSearchFilter}
						row
					>	
						{searchFilters.map(filter => (
							<FormControlLabel 
								key={filter.value} 
								control={<Radio size='small' />} 
								value={filter.value}
								label={filter.label} /> 
						))}
					</RadioGroup>
				</FormGroup>

				<Divider sx={{ my: 3 }} />

				{ isSuccess && <InfiniteArtList infinteData={infinteData} /> }
			</Paper>

			{ isNotLast && <LoadMoreButton onClick={() => fetchNextPage()} />  }
			
			<ScrollTop />
		</Container>
	);
};

export default Arts;
