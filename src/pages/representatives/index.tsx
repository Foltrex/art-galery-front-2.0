import { Box, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import RepresentativeForm from './RepresentativeForm';
import RepresentativeTable from './RepresentativeTable';
import { useQuery } from 'react-query';


const Representatives = () => {
	const [openCreateForm, setOpenCreateForm] = useState(false);
    // const { isLoading, error, data } = useQuery()

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
            </Paper>
        </div>	
	);
};

export default Representatives;
