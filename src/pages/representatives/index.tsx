import { Paper } from '@mui/material';
import * as React from 'react';
import DeleteModal from '../../components/modal/DeleteModal';
import Table from '../../components/table/Table';


const Representatives = () => {
	return (
		<div>
			<Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: "1%"}}>
				{/* <Table 
					data={data} 
					columns={columns} 
					title={'Representatives'} 
					onDelete={() => alert('Deleted representative')} 
					onEdit={() => alert('Edited representative')} 
				/> */}
				{/* <Repre /> */}
				{/* <DeleteModal /> */}
			</Paper>
		</div>
	);
};

export default Representatives;
