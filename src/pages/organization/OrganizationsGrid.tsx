import * as React from 'react';
import {useGetAllOrganizations} from '../../api/OrganizationApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Organization} from "../../entities/organization";

interface IOrganizationData {
    id: string;
    name: string;
    status: string;
    address: string;
}

const columns: IColumnType<IOrganizationData>[] = [
    {
        key: 'name',
        title: 'Name',
        minWidth: 150
    },
    {
        key: 'status',
        title: 'Status',
        minWidth: 150
    },
    {
        key: 'address',
        title: 'Address',
        minWidth: 150
    },
];


const mapFacilityToTableRow = (organization: Organization): IOrganizationData => {
    const address = organization.address;
    const city = address?.city;
    return {
        id: organization.id,
        name: organization.name,
        status: organization.status,
        address: address ? (city ? city.name + ', ' : '') + address.fullName: ''
    };
}

const OrganizationGrid = () => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [pageNumber, setPageNumber] = React.useState(0);

    const { data } = useGetAllOrganizations({page: pageNumber, size: rowsPerPage});


    const handleDelete = async (data: Organization) => {
        alert('delete org')
    }


    const handleEdit = (data: Organization) => {
        alert('edit org')
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

            <DeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={() => {}} />
        </>
    );
};

export default OrganizationGrid;
