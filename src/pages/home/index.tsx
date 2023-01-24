import {Divider, Grid, Typography} from '@mui/material';

import {Stack} from '@mui/system';
import * as React from 'react';
import {OrganizationStatusEnum} from '../../entities/enums/organizationStatusEnum';
import {Organization as Company} from '../../entities/organization';
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import logo from './logo.png';

const Organization = () => {
    const organization: Company = {
        id: '1',
        name: 'Roga and Kopita',
        address: {
            id: '312414',
            city: {
                id: 'asdf12',
                name: 'Homel',
                latitude: 12.21,
                longitude: 31.41,
            },
            streetName: 'Hataevhicha',
            streetNumber: 51,
        },
        status: OrganizationStatusEnum.NEW,
        facilities: []
    }

	return (
		<Grid container
			spacing={0}
			sx={{ marginTop: "4%" }}
			justifyContent="center"
		>
			<Grid item sm={4}>
				<img src={logo} alt='Organization logo' width='250' height='250' />
			</Grid>
			<Grid item sm={6}>
				<Typography variant='h4'>
					{organization.name ? organization.name : 'The name is not set'}
				</Typography>
				<Divider />
				<Stack spacing={2} sx={{ marginTop: 4 }}>
					<Grid container>
						<Grid item sm={4}><strong>Status</strong></Grid>
						<Grid item sm={8}>
							<span style={{ 
								color: PrepareDataUtil.getOrganizationStatusColor(organization.status)
							}}>
								{organization.status}
							</span>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item sm={4}><strong>Email</strong></Grid>
						<Grid item sm={8}>tonasdf@gmail.com</Grid>
					</Grid>
					<Grid container>
						<Grid item sm={4}><strong>Address</strong></Grid>
						<Grid item sm={8}>
							{organization.address ? PrepareDataUtil.parseAddress(organization.address) : "The address is not set"}
						</Grid>
					</Grid>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2327.1556905573466!2d26.873946816081872!3d54.31887890911977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dc742535316e4f%3A0xc55af1e363a4e804!2sUlitsa%20M.bogdanovicha%2C%20Maladzie%C4%8Dna!5e0!3m2!1sen!2sby!4v1673598101285!5m2!1sen!2sby"
						width="600"
						height="350"
						style={{ border: '0' }}
						allowFullScreen={false}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade" />
				</Stack>
			</Grid>
		</Grid>
	);
};

export default Organization;
