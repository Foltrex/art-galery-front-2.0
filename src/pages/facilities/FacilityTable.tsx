import * as React from 'react';
import {useDeleteFacility, useGetFacilitiesPageByAccountId} from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Facility} from '../../entities/facility';
import {AuthService} from '../../services/AuthService';
import {TokenService} from '../../services/TokenService';
import FacilityForm from './FacilityForm';
import {Address} from "../../entities/address";
import {Organization} from "../../entities/organization";


const columns: IColumnType<Facility>[] = [
	{
		key: 'name',
		title: 'Name',
		minWidth: 150
	},
	{
		key: 'isActive',
		title: 'Activity',
		minWidth: 150,
		render: (f) => f.isActive ? 'Active' : 'Inactive',
	},
	{
		key: 'address',
		title: 'Address',
		minWidth: 150,
		render: (f) => f.address?.name
	},
	{
		key: 'organization',
		title: 'Organization',
		minWidth: 150,
		render: (f) => f.organization.name!
	},
];

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
