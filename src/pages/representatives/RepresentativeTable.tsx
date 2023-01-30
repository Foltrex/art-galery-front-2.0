import * as React from 'react';
import { useState } from 'react';
import DeleteModal from '../../components/modal/DeleteModal';
import Table, { IColumnType, IdentifiableRecord } from '../../components/table/Table';
import { OrganizationRoleEnum } from '../../entities/enums/organizationRoleEnum';
import { OrganizationStatusEnum } from '../../entities/enums/organizationStatusEnum';
import { Representative } from '../../entities/representative';
import RepresentativeForm from './RepresentativeForm';

interface IRepresentativeTableProps {
}

interface IRepresentativeData {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    organizationRole: string;
    facility: string;
}

const columns: IColumnType<IRepresentativeData>[] = [
	{key: 'firstname', title: 'Firstname'},
	{key: 'lastname', title: 'lastname'},
	{key: 'email', title: 'Email'},
	{key: 'organizationRole', title: 'Role'},
    {key: 'facility', title: 'Facility'}
];

const data: Representative[] = []
// const data: Representative[] = [
//     {
//         id: 'qw9h9asdf',
//         firstname: 'Dmitriy',
//         lastname: 'Reznov',
//         organization: {
//             id: 'uasdbif',
//             name: 'Roga and Kopita',
//             address: {
//                 id: 'w0qweqw0we',
//                 city: {
//                     id: '1111asdf',
//                     name: 'Homel',
//                     latitude: 12.31,
//                     longitude: 41.21
//                 },
//                 streetName: 'Bogdanovicha',
//                 streetNumber: 100
//             },
//             status: OrganizationStatusEnum.ACTIVE,
//             facilities: []
//         },
//         facility: {
//             id: '0asdufbi',
//             name: 'Lidbeer',
//             isActive: true,
//             address: {
//                 id: 'sdf09123',
//                 city: {
//                     id: '182039',
//                     name: 'Homel',
//                     latitude: 12.314,
//                     longitude: 31.124
//                 },
//                 streetName: 'Kulman',
//                 streetNumber: 123
//             },
//             organization: {
//                 id: 'uasdbif',
//                 name: 'Roga and Kopita',
//                 address: {
//                     id: 'w0qweqw0we',
//                     city: {
//                         id: '1111asdf',
//                         name: 'Homel',
//                         latitude: 12.31,
//                         longitude: 41.21
//                     },
//                     streetName: 'Bogdanovicha',
//                     streetNumber: 100
//                 },
//                 status: OrganizationStatusEnum.ACTIVE,
//                 facilities: []
//             }
//         },
//         organizationRole: {
//             id: '1',
//             name: OrganizationRoleEnum.MEMBER
//         },
//         accountId: 'asdf09w9032f'
//     },
//     {
//         id: '08asdf',
//         firstname: 'Alex',
//         lastname: 'Mayson',
//         organization: {
//             id: 'uasdbif',
//             name: 'Roga and Kopita',
//             address: {
//                 id: 'w0qweqw0we',
//                 city: {
//                     id: '1111asdf',
//                     name: 'Homel',
//                     latitude: 12.31,
//                     longitude: 41.21
//                 },
//                 streetName: 'Bogdanovicha',
//                 streetNumber: 100
//             },
//             status: OrganizationStatusEnum.ACTIVE,
//             facilities: []
//         },
//         facility: {
//             id: '0asdufbi',
//             name: 'Lidbeer',
//             isActive: true,
//             address: {
//                 id: 'sdf09123',
//                 city: {
//                     id: '182039',
//                     name: 'Homel',
//                     latitude: 12.314,
//                     longitude: 31.124
//                 },
//                 streetName: 'Kulman',
//                 streetNumber: 123
//             },
//             organization: {
//                 id: 'uasdbif',
//                 name: 'Roga and Kopita',
//                 address: {
//                     id: 'w0qweqw0we',
//                     city: {
//                         id: '1111asdf',
//                         name: 'Homel',
//                         latitude: 12.31,
//                         longitude: 41.21
//                     },
//                     streetName: 'Bogdanovicha',
//                     streetNumber: 100
//                 },
//                 status: OrganizationStatusEnum.ACTIVE,
//                 facilities: []
//             }
//         },
//         organizationRole: {
//             id: '1',
//             name: OrganizationRoleEnum.CREATOR
//         },
//         accountId: '09a0sdfh'
//     }
// ];


const mapRepresentativeToTableRow = (representative: Representative): IRepresentativeData => {
    const { facility, organizationRole } = representative;
        
    return {
        id: representative.id,
        firstname: representative.firstname,
        lastname: representative.lastname,
        email: 'unknown',
        organizationRole: organizationRole.name,
        facility: facility.name
    };
}

const RepresentativeTable: React.FunctionComponent<IRepresentativeTableProps> = (props) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [representative, setRepresentative] = useState<Representative>();

    const handleDelete = (data: Representative) => {
        setRepresentative(data);
        setOpenDeleteModal(true);
    }

    const handleEdit = (data: Representative) => {
        setRepresentative(data);
        setOpenEditForm(true);
    }

	return (
        <>
            {/* <Table
                columns={columns}
                pages={data}
                onDelete={handleDelete}
                onEdit={handleEdit} 
                mapModelToTableRow={mapRepresentativeToTableRow} /> */}

            <RepresentativeForm 
                open={openEditForm} 
                onClose={() => setOpenEditForm(false)}
                representative={representative} />    
            <DeleteModal 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)} 
                onDelete={() => alert(`Delete modal with id: ${representative?.id}`)} />
        </>
  	);
};

export default RepresentativeTable;
