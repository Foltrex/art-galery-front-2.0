import * as React from 'react';
import DeleteModal from '../../components/modal/DeleteModal';
import Table, { IColumnType, IdentifiableRecord } from '../../components/table/Table';
import { Address } from '../../entities/address';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import { Facility } from '../../entities/facility';
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

const data: Facility[] = [
	{
		id: 'asdfo-121234',
		name: 'Lidbeer',
		isActive: true,
		address: {
			id: 'w0qweqw0we',
			city: {
				id: '1111asdf',
				name: 'Homel',
				latitude: 12.31,
				longitude: 41.21
			},
			streetName: 'Bogdanovicha',
			streetNumber: 100
		},
		organization: {
			id: 'uasdbif',
			name: 'Roga and Kopita',
			address: {
				id: 'w0qweqw0we',
				city: {
					id: '1111asdf',
					name: 'Homel',
					latitude: 12.31,
					longitude: 41.21
				},
				streetName: 'Bogdanovicha',
				streetNumber: 100
			},
			status: OrganizationStatusEnum.ACTIVE,
			facilities: []
		}
	},
	{
		id: 'q0w8h9asdf',
		name: 'Pinta',
		isActive: false,
		address: {
			id: 'w0qweqw0we',
			city: {
				id: '1111asdf',
				name: 'Homel',
				latitude: 12.31,
				longitude: 41.21
			},
			streetName: 'Bogdanovicha',
			streetNumber: 100
		},
		organization: {
			id: 'uasdbif',
			name: 'Roga and Kopita',
			address: {
				id: 'w0qweqw0we',
				city: {
					id: '1111asdf',
					name: 'Homel',
					latitude: 12.31,
					longitude: 41.21
				},
				streetName: 'Bogdanovicha',
				streetNumber: 100
			},
			status: OrganizationStatusEnum.ACTIVE,
			facilities: []
		}
	}
];


const mapFacilityToTableRow = (facility: Facility): IFacilityData => {
	const address: Address = facility.address;
	const addressString: string = [
		address.city.name, 
		address.streetName, 
		address.streetNumber
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
				data={data}
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
