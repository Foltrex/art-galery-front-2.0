import { ArrowDropDown } from '@mui/icons-material';
import { Box, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import Paper from '@mui/material/Paper';
import React, { ChangeEvent, useState } from 'react';
import { useGetAllCities } from '../../api/CityApi';
import { useGetAllFacilities } from '../../api/FacilityApi';
import SearchBar from '../../components/ui/SearchBar';
import { City } from '../../entities/city';
import FacilityTable from './FacilityTable';
import CityDropdown from '../../components/cities/CityDropdown';

const Facilities = () => {
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [pageNumber, setPageNumber] = React.useState(0);

	const [facilityName, setFacilityName] = useState<string>();

	const { data: cities, isSuccess: isSuccessCities } = useGetAllCities();

	const [city, setCity] = useState<City>();

	const handleCityChange = (e: SelectChangeEvent<string>) => {
		const currentCity = cities?.find(city => city.id === e.target.value);
		setCity(currentCity);
	}

	const statuses: {label: string, value?: boolean}[] = [
		{label: 'active', value: true},
		{label: 'inactive', value: false},
		{label: 'all'}
	];
	const [facilityStatus, setFacilityStatus] = useState(statuses[2]);

	const { data, isFetching, isSuccess: isSuccessFacilities } = useGetAllFacilities(
		pageNumber,
		rowsPerPage,
		city?.id,
		facilityName,
		facilityStatus.value
	);


	const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
		const currentStatus = statuses.find(s => s.label === e.target.value);
		setFacilityStatus(currentStatus!);
	}

	const renderCityDropdown = () => {
		if (isSuccessCities && cities?.length !== 0) {
			return (
				<CityDropdown
					value={city?.id}
					cities={cities} 
					onChange={handleCityChange} />
			);
		} else if (isSuccessCities && (!cities || cities.length === 0)) {
			return (
				<CityDropdown disabled />
			);
		} else {
			return (
				<Skeleton sx={{ flex: '20%' }} />
			);
		}
	}

	return (
		<>
			<Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '1%' }}>
				<Box sx={{ display: 'flex', mt: 3, justifyContent: 'center', pl: 3 }}>
					{renderCityDropdown()}

					<SearchBar
						onSearch={(text) => setFacilityName(text)}
						placeholder={'Enter facility name...'}
						style={{ flex: '60%' }}
					/>
				</Box>

				<FormControl sx={{ mt: 2, pl: '80%' }}>
					<RadioGroup
						name='status'
						value={facilityStatus.label}
						onChange={handleStatusChange}
						row
					>
						{statuses.map(status => (
							<FormControlLabel 
								key={status.label} 
								value={status.label} 
								control={<Radio />} 
								label={status.label} 
							/>
						))}
					</RadioGroup>
				</FormControl>

				<Divider sx={{ my: 2 }} />

				<FacilityTable 
					data={data} 
					isFetching={isFetching} 
					isSuccess={isSuccessFacilities} 
					onPageChange={(page: number) => setPageNumber(page)} 
				/>
			</Paper>
		</>
	);
};

export default Facilities;
