import { Paper } from '@mui/material';
import { Column } from 'material-table';
import * as React from 'react';
import DeleteModal from '../../components/modal/DeleteModal';
import Table from '../../components/table/Table';

interface IRepresentativeData {
	number: number;
	firstname: string;
	lastname: string;
	email: string;
	organizationRole: string;
	facility: string;
}

const columns: Column<IRepresentativeData>[] = [
	{ title: '#', field: 'number' },
	{ title: 'First Name', field: 'firstname' },
	{ title: 'Last Name', field: 'lastname' },
	{ title: 'Email', field: 'email' },
	{ title: 'Role', field: 'organizationRole' },
	{ title: 'Facility', field: 'facility' }
];

const data: IRepresentativeData[] = [
	{
		number: 1,
		firstname: 'Dmitriy',
		lastname: 'Reznov',
		email: 'reznov@gmail.com',
		organizationRole: 'MODERATOR',
		facility: 'Lidbeer'
	}
];

const Representatives = () => {
	return (
		<div>
			<Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: "1%"}}>
				<Table 
					data={data} 
					columns={columns} 
					title={'Representatives'} 
					onDelete={() => alert('Deleted representative')} 
					onEdit={() => alert('Edited representative')} 
				/>
				{/* <Repre /> */}
				<DeleteModal />
			</Paper>
		</div>
	);
};

export default Representatives;
