import * as React from 'react';
import { useDeleteFacility } from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, { IColumnType } from '../../components/table/Table';
import { Facility } from '../../entities/facility';
import { IPage, createEmptyPage } from '../../hooks/react-query';
import FacilityForm from './FacilityForm';
import { Checkbox, IconButton, Typography } from '@mui/material';
import { TokenService } from '../../services/TokenService';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { Map } from '@mui/icons-material';
import { Address } from '../../entities/address';
import MapDialog from '../../components/map/MapDialog';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useRootStore } from '../../stores/provider/RootStoreProvider';

import * as MetadataUtils from "../../util/MetadataUtil";
import { OrganizationRoleEnum } from '../../entities/enums/organizationRoleEnum';

interface IFacilityTableProps {
	data?: IPage<Facility>;
	isFetching: boolean;
	isSuccess: boolean;
	onPageChange: (page: number) => void;
}

const FacilityTable: React.FC<IFacilityTableProps> = ({data, isFetching, isSuccess, onPageChange}) => {

	const { authStore } = useRootStore();
	const { account } = authStore; 
	const organizationRole = MetadataUtils.find('organization_role', account);

	const [openEditForm, setOpenEditForm] = React.useState(false);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [currentFacilityAddress, setCurrentFacilityAddress] = React.useState<Address>();
	const [facility, setFacility] = React.useState<Facility>();
	
	const [selectedFacilitiesId, setSelectedFacilitiesId] = React.useState<string[]>([]);

	const handleFacilityCheckboxClick = (selectedFacilityId: string) => {
		const indexOfFacilityId = selectedFacilitiesId.indexOf(selectedFacilityId);
		if (indexOfFacilityId === -1) {
			setSelectedFacilitiesId([...selectedFacilitiesId, selectedFacilityId]);
		} else {
			const filteredArray = selectedFacilitiesId.filter(facilityId => facilityId !== selectedFacilityId);
			setSelectedFacilitiesId(filteredArray);
		}
	}
	
	const columns: IColumnType<Facility>[] = [
		{
			key: 'selected',
			title: '',
			minWidth: 10,
			render: (facility) => TokenService.getCurrentAccountType() === AccountEnum.ARTIST
					?  <Checkbox onClick={() => handleFacilityCheckboxClick(facility.id)} />
					: <></>
		},
		{
			key: 'name',
			title: 'Name',
			minWidth: 150
		},
		{
			key: 'organization',
			title: 'Organization',
			minWidth: 150,
			render: (facility) => facility.organization.name!
		},
		{
			key: 'location',
			title: 'Location',
			minWidth: 150,
			render: (facility) => {
				return (
					<IconButton 
						onClick={() => {
							if (!!facility.address) {
								setCurrentFacilityAddress(facility.address);
							}
						}}
					>
						<Map />
					</IconButton>
				)
			}
		},
		{
			key: 'status',
			title: 'Status',
			minWidth: 150,
			render: (facility) => facility.isActive 
				?  <Typography sx={{color: 'success.main'}}>Active</Typography>
				: <Typography sx={{color: 'error.main'}}>Inactive</Typography>,
		},
		{
			key: 'actions',
			title: '',
			render: (facility) => {
				return (
					<>
					<IconButton
						disableRipple
						aria-label='edit'
						onClick={() => handleEdit(facility)}
					>
						<ModeOutlinedIcon />
					</IconButton>
					<IconButton
						disableRipple
						aria-label='delete'
						onClick={() => handleDelete(facility)}
					>
						<DeleteOutlinedIcon />
					</IconButton>
				</>
				);
			}
		}
	];
	
	const handleDelete = async (data: Facility) => {
		setFacility(data);
		setOpenDeleteModal(true);
	}

	const mutationDelete = useDeleteFacility();

	const onDelete = async () => {
		try {
			await mutationDelete.mutateAsync(facility!.id);
		} catch (e) {
			// add push notification
			console.log(e);
		}
	}

	const handleEdit = (data: Facility) => {
		setFacility(data);
		setOpenEditForm(true);
	}

	const handlePageChange = (page: number) => {
		onPageChange(page);
	}

	const currentAccountType = TokenService.getCurrentAccountType();
	const isTableRowsEditableByCurrentUser = currentAccountType === AccountEnum.SYSTEM 
		|| (currentAccountType === AccountEnum.REPRESENTATIVE
				&& (organizationRole === OrganizationRoleEnum.CREATOR  
					|| organizationRole === OrganizationRoleEnum.MODERATOR
					)
			);
		
	const renderTable = () => {
		if (isSuccess && data) {
			return (
				<Table
					columns={columns}
					onDelete={handleDelete}
					onEdit={handleEdit}
					page={data}
					onPageChange={(_, page) => handlePageChange(page)}
					onRowsPerPageChange={(event) => alert(event)} 
					editable={isTableRowsEditableByCurrentUser}	
				/>
			);
		} else if (isFetching) {
			return (
				<SkeletonTable columns={columns}/>
			);
		} else {
			const emptyPage = createEmptyPage<Facility>();
			return (
				<Table
					columns={columns}
					onDelete={handleDelete}
					onEdit={handleEdit}
					page={emptyPage}
					onPageChange={(_, page) => handlePageChange(page)}
					onRowsPerPageChange={(event) => alert(event)} 
					editable={isTableRowsEditableByCurrentUser} 
				/>
			);
		}
	}

	return (
		<>
			{renderTable()}

			<FacilityForm
				open={openEditForm}
				onClose={() => setOpenEditForm(false)}
				facility={facility} />
			<DeleteModal
				open={openDeleteModal}
				onClose={() => setOpenDeleteModal(false)}
				onDelete={onDelete} />
			<MapDialog 
				open={!!currentFacilityAddress} 
				onClose={() => setCurrentFacilityAddress(undefined)} 
				address={currentFacilityAddress}
				setFieldValue={(address) => console.log(address)} 
			/>
		</>
	);
};

export default FacilityTable;
