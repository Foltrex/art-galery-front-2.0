import { Box, Button, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import DeleteModal from '../../components/modal/DeleteModal';
import Table from '../../components/table/Table';
import { Representative } from '../../entities/representative';
import FacilityForm from '../facilities/FacilityForm';
import RepresentativeForm from './RepresentativeForm';
import RepresentativeTable from './RepresentativeTable';


const Representatives = () => {
	const [openCreateForm, setOpenCreateForm] = useState(false);

	return (
        <div>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Typography variant='h4' align='left'>
					<b>Representatives</b>
				</Typography>
                <Button
                    style={{marginLeft: '1%'}}
                    variant='contained'
                    color='primary'
                    onClick={() => setOpenCreateForm(true)}
                >
                    Create representative
                </Button>
                <RepresentativeForm 
					open={openCreateForm} 
					onClose={() => setOpenCreateForm(false)}
                />
            </Box>
            <Paper sx={{width: '100%', overflow: 'hidden'}} style={{marginTop: '1%'}}>
				<RepresentativeTable />
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
	);
};

export default Representatives;
