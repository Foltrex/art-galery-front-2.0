import {Alert, Box, Button, Divider, Grid, Stack, Typography} from '@mui/material';
import * as React from 'react';
import {useGetOrganizationByAccountId} from '../../api/OrganizationApi';
import {useGetRepresentativeByAccountId} from '../../api/RepresentativeApi';
import Loading from '../../components/ui/Loading';
import {OrganizationRoleEnum} from '../../entities/enums/organizationRoleEnum';
import {OrganizationStatusEnum} from '../../entities/enums/organizationStatusEnum';
import {TokenService} from '../../services/TokenService';
import OrganizationEditDialog from '../home/edit/OrganizationEditDialog';
import {OrganizationStatus} from "./OrganizationStatus";

interface IAppProps {
}

const App: React.FunctionComponent<IAppProps> = (props) => {
	const accountId = TokenService.getCurrentAccountId();
	const [openEditForm, setOpenEditForm] = React.useState(false)
	const { data: organization, isLoading, isIdle, isError, error } = useGetOrganizationByAccountId(accountId);
	const { data: representative } = useGetRepresentativeByAccountId(accountId);
	const organizationRole = representative?.organizationRole?.name;
	const isOrganizationEditableByThisAccount = organizationRole === OrganizationRoleEnum.CREATOR;

	if (isLoading || isIdle) {
		return <Loading />
	}
	if (isError) {
		return <Box display="flex" justifyContent="center">Error: {error.message}</Box>
	}

	const AlertWarning = () => {
		if (organization.status === OrganizationStatusEnum.NEW) {
			return (
				<Alert severity="warning">
					Please, {' '}
					<span style={{ cursor: "pointer" }} onClick={() => setOpenEditForm(true)}>
						<b><u>fill</u></b>
					</span>{' '}
					the data about your organization!
				</Alert>
			)
		} else {
			return null
		}
	}

	const Render = () => {
		return (
			<div>
				<OrganizationEditDialog
					open={openEditForm}
					onClose={() => setOpenEditForm(false)}
					organization={organization}
				/>

				{isOrganizationEditableByThisAccount && <AlertWarning />}

				<Box display="flex" justifyContent="center">
					<Grid
						sx={{ marginTop: "4%", width: "50vw" }}
						justifyContent="center"
					>
						<Grid item sm={12}>
							<Typography variant='h4'>
								{organization.name}{' '}
								{isOrganizationEditableByThisAccount &&
									<Button onClick={() => setOpenEditForm(true)}>
										Edit
									</Button>
								}
							</Typography>
							<Divider />
							<Stack spacing={2} sx={{ marginTop: 4 }}>
								<Grid container>
									<Grid item sm={4}><strong>Status</strong></Grid>
									<Grid item sm={8}>
										<OrganizationStatus organization={organization}/>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item sm={4}><strong>Address</strong></Grid>
									<Grid item sm={8}>
										{organization.address ? (organization.address.fullName) : "empty"}
									</Grid>
								</Grid>
								<Grid container>
									<Grid item sm={4}><strong>Email</strong></Grid>
									<Grid item sm={8}>{TokenService.getCurrentDecodedToken().sub}</Grid>
								</Grid>
							</Stack>
						</Grid>
					</Grid>
				</Box>
			</div>
		);
	}

	return (
		<div><Render /></div>
	)

};

export default App;
