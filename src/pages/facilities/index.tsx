import { Box, Button, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '../../components/table/Table';
import FacilityForm from './FacilityForm';
import FacilityTable from './FacilityTable';


const Facilities = () => {
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
                    style={{marginLeft: '1%'}}
                    variant='contained'
                    color='primary'
                    // onClick={handleClickOpen}
                >
                    Create facility
                </Button>
                <FacilityForm 
					open={true} 
					onClose={function (): void {
					throw new Error('Function not implemented.');
				} }
                />
            </Box>
            <Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: '1%'}}>
				<FacilityTable />
                {/* <FacilityTablePagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalElements={totalElements}
                /> */}
                {/* <FacilityTable
                    facilities={facilities}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalElements={totalElements}
                    organizations={organizations}
                    cities={cities}/> */}
            </Paper>
        </div>		
		// <div>
		// 	<Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: "1%"}}>
		// 		<Table 
		// 			data={data} 
		// 			columns={columns} 
		// 			title={'Facilities'} 
		// 			onDelete={(event, data) => alert(`Delete by id: ${data?.id}`)} 
		// 			onEdit={(event, data) => alert(`Edited by id: ${data?.id}`)} 
		// 		/>
		// 	</Paper>
		// </div>
    );
};

export default Facilities;
