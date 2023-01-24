import Paper from '@mui/material/Paper';
import { Column } from 'material-table';
import Table from '../../components/table/Table';

interface IFacilityData {
	id: number;
    number: number;
    name: string;
    isActive: string;
    address: string;
    organization: string;
}

const columns: Column<IFacilityData>[] = [
	{title: '#', field: 'number'},
    {title: 'Name', field: 'name'},
    {title: 'Activity', field: 'isActive'},
	{title: 'Address', field: 'address'},
	{title: 'Organization', field: 'organization'}
];

const data: IFacilityData[] = [
	{
		id: 1,
		number: 1,
		name: 'Lidbeer',
		isActive: 'Active',
		address: 'Bogdanocicha',
		organization: 'Roga and Kopita'
	},
	{
		id: 2,
		number: 2,
		name: 'Pints',
		isActive: 'Active',
		address: 'Kulman',
		organization: 'Roga and Kopita'
	}
];

const Facilities = () => {
    return (
		<div>
			<Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: "1%"}}>
				<Table 
					data={data} 
					columns={columns} 
					title={'Facilities'} 
					onDelete={(event, data) => alert(`Delete by id: ${data?.id}`)} 
					onEdit={(event, data) => alert(`Edited by id: ${data?.id}`)} 
				/>
			</Paper>
		</div>
    );
};

export default Facilities;
