import * as React from 'react';
import { useAddFacility, useGetFacilitiesList } from '../../api/FacilityApi';
import DeleteModal from '../../components/modal/DeleteModal';
import Table, { IColumnType, IdentifiableRecord } from '../../components/table/Table';
import { Address } from '../../entities/address';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import { Facility } from '../../entities/facility';
import { useFetch } from '../../hooks/react-query';
import FacilityForm from './FacilityForm';

interface IFacilityTableProps {
}

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
	const address: Address = facility.address;
	const addressString: string = [
		address.fullName
	].join(', ');

	const organizationName = facility.organization.name!;
	
	return {
		id: facility.id,
		name: facility.name,
		activity: facility.isActive ? 'Active' : 'Inactive',
		address: addressString,
		organization: organizationName
	};
}

const FacilityTable: React.FunctionComponent<IFacilityTableProps> = (props) => {
	const [openEditForm, setOpenEditForm] = React.useState(false);
	const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
	const [facility, setFacility] = React.useState<Facility>();

	const { data } = useGetFacilitiesList();

	const handleDelete = (data: Facility) => {
		setFacility(data);
		setOpenDeleteModal(true);
	}

    const handleEdit = (data: Facility) => {
        setFacility(data);
        setOpenEditForm(true);
    }

	return (
		<>
			<Table
				columns={columns}
				data={data ?? []}
				onDelete={handleDelete}
				onEdit={handleEdit} 
				mapModelToTableRow={mapFacilityToTableRow} />
			<FacilityForm 
				open={openEditForm} 
				onClose={() => setOpenEditForm(false)}
				facility={facility} />
            <DeleteModal 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)} 
                onDelete={() => alert(`Delete modal with id: ${facility?.id}`)} />
		</>
  	);
};

export default FacilityTable;
