import * as React from 'react';
import { useDeleteFacility, useGetFacilitiesPageByAccountId } from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, { IColumnType } from '../../components/table/Table';
import { Facility } from '../../entities/facility';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
import FacilityForm from './FacilityForm';

interface IFacilityData {
	id: string;
	name: string;
	activity: string;
	address: string;
	organization: string;
}

const columns: IColumnType<IFacilityData>[] = [
	{
		key: 'name',
		title: 'Name',
		minWidth: 150
	},
	{
		key: 'activity',
		title: 'Activity',
		minWidth: 150
	},
	{
		key: 'address',
		title: 'Address',
		minWidth: 150
	},
	{
		key: 'organization',
		title: 'Organization',
		minWidth: 150
	},
];


const mapFacilityToTableRow = (facility: Facility): IFacilityData => {
	return {
		id: facility.id,
		name: facility.name,
		activity: facility.isActive ? 'Active' : 'Inactive',
		address: facility.address?.fullName,
		organization: facility.organization.name!
	};
}

const FacilityTable = () => {
	const [openEditForm, setOpenEditForm] = React.useState(false);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [facility, setFacility] = React.useState<Facility>();

	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [pageNumber, setPageNumber] = React.useState(0);

	const token = TokenService.decode(AuthService.getToken());
	const { data } = useGetFacilitiesPageByAccountId(token.id, pageNumber, rowsPerPage);

	
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

	return (
		<>
			{data && data.content
				? 	<Table
						columns={columns}
						onDelete={handleDelete}
						onEdit={handleEdit}
						mapModelToTableRow={mapFacilityToTableRow}
						page={data}
						onPageChange={(_, page) => setPageNumber(page)} 
						onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)} />
				: 	<SkeletonTable 
						columns={columns} 
						rowsPerPage={rowsPerPage} />
			}

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
