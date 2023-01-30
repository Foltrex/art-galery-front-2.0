import { Box, Button, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { useGetFacilitiesList } from '../../api/FacilityApi';
import Table from '../../components/table/Table';
import FacilityForm from './FacilityForm';
import FacilityTable from './FacilityTable';


const Facilities = () => {
	const [openCreateForm, setOpenCreateForm] = useState(false);

	return (
		<div>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<Typography variant='h4' align='left'>
					<b>Facilities</b>
				</Typography>
				<Button
					style={{ marginLeft: '1%' }}
					variant='contained'
					color='primary'
					onClick={() => setOpenCreateForm(true)}
				>
					Create facility
				</Button>
				<FacilityForm
					open={openCreateForm}
					onClose={() => setOpenCreateForm(false)}
				/>
			</Box>
			<Paper sx={{ width: '100%', overflow: 'hidden' }} style={{ marginTop: '1%' }}>
				<FacilityTable />
			</Paper>
		</div>
	);
};

export default Facilities;
