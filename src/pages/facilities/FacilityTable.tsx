import * as React from 'react';
import Table, { IColumnType } from '../../components/table/Table';
import { Address } from '../../entities/address';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import { Facility } from '../../entities/facility';

interface IFacilityTableProps {
}

interface IFacilityData {
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

const mapToFacilityTableData = (facilities: Facility[]): IFacilityData[] => {
	return facilities.map(facility => {
		const address: Address = facility.address;
		const addressString: string = [
			address.city.name, 
			address.streetName, 
			address.streetNumber
		].join(', ');

		const organizationName = facility.organization.name!;
		console.log(organizationName);
		
		const facilityData: IFacilityData = {
			name: facility.name,
			activity: facility.isActive ? 'Active' : 'Inactive',
			address: addressString,
			organization: organizationName
		};

		return facilityData;
	});
}


const FacilityTable: React.FunctionComponent<IFacilityTableProps> = (props) => {
	return (
		<Table 
			title='Facilities' 
			columns={columns} 
			data={mapToFacilityTableData(data)} 
			onDelete={(e, data) => alert(`Deleted facility: ${JSON.stringify(data)}`)} 
			onEdit={(e, data) => alert(`Edited facility: ${JSON.stringify(data)}`)} />
  	);
};

export default FacilityTable;
