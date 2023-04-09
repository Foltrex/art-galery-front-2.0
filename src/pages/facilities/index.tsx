import {FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import React, {ChangeEvent, useState} from 'react';
import {useGetAllFacilities} from '../../api/FacilityApi';
import FacilityTable from './FacilityTable';
import CityDropdown from '../../components/cities/CityDropdown';
import {TypeFilter} from "../../components/form/TypeFilter";

const Facilities = () => {
	const [rowsPerPage, setRowsPerPage] = React.useState(25);
	const [pageNumber, setPageNumber] = React.useState(0);

	const [facilityName, setFacilityName] = useState<string>();

	const [cityId, setCityId] = useState<string>();

	const handleCityChange = (cityId:string) => {
		setCityId(cityId);
	}

	const statuses: {label: string, value?: boolean}[] = [
		{label: 'all'},
		{label: 'active', value: true},
		{label: 'inactive', value: false},
	];
	const [facilityStatus, setFacilityStatus] = useState(statuses[0]);

	const { data, isFetching, isSuccess: isSuccessFacilities } = useGetAllFacilities(
		pageNumber,
		rowsPerPage,
		cityId,
		facilityName,
		facilityStatus.value
	);


	const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
		const currentStatus = statuses.find(s => s.label === e.target.value);
		setFacilityStatus(currentStatus!);
	}

	return (
		<>
			<div className="filter-row">
				<CityDropdown value={cityId} onChange={handleCityChange} />
				<TypeFilter placeholder={"Facility name"} onChange={(text) => setFacilityName(text)} />
				<FormControl>
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
			</div>

			<FacilityTable
				data={data}
				isFetching={isFetching}
				isSuccess={isSuccessFacilities}
				onPageChange={setPageNumber}
				onRowsPerPageChange={setRowsPerPage}
			/>
		</>
	);
};

export default Facilities;
