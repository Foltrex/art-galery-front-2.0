import * as React from 'react';
import {useDeleteFacility} from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Facility} from '../../entities/facility';
import {createEmptyPage, IPage} from '../../hooks/react-query';
import FacilityForm from './FacilityForm';
import {Checkbox, IconButton, Typography} from '@mui/material';
import {TokenService} from '../../services/TokenService';
import {AccountEnum} from '../../entities/enums/AccountEnum';
import {Address} from '../../entities/address';
import ModeOutlinedIcon from '@mui/icons-material/ModeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {OrganizationRoleEnum} from '../../entities/enums/organizationRoleEnum';
import {useGetLoggedUserRole} from '../../hooks/useGetLoggedUserRole';

interface IFacilityTableProps {
	data?: IPage<Facility>;
	isFetching: boolean;
	isSuccess: boolean;
	onPageChange: (page: number) => void;
	onRowsPerPageChange: (pageSize: number) => void;
}

const FacilityTable: React.FC<IFacilityTableProps> = ({data, onRowsPerPageChange, isFetching, isSuccess, onPageChange}) => {
	const organizationRole = useGetLoggedUserRole();

	const [openEditForm, setOpenEditForm] = React.useState(false);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
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
			key: 'city',
			title: 'City',
			render: (facility) => facility?.address?.city?.name
		},
		{
			key: 'address',
			title: 'Address',
			minWidth: 150,
			render: (facility) => facility?.address?.name
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


	const currentAccountType = TokenService.getCurrentAccountType();
	const isTableRowsEditableByCurrentUser = currentAccountType === AccountEnum.SYSTEM 
		|| (currentAccountType === AccountEnum.REPRESENTATIVE
				&& (organizationRole === OrganizationRoleEnum.CREATOR  
					|| organizationRole === OrganizationRoleEnum.MODERATOR
					)
			);

	const renderTable = () => {
		if (isFetching) {
			return (
				<SkeletonTable columns={columns}/>
			);
		} else {
			return (
				<Table
					columns={columns}
					onDelete={handleDelete}
					onEdit={handleEdit}
					page={isSuccess && data ? data : createEmptyPage<Facility>()}
					onPageChange={onPageChange}
					onRowsPerPageChange={onRowsPerPageChange}
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
		</>
	);
};

export default FacilityTable;
