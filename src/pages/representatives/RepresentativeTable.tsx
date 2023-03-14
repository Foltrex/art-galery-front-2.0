import * as React from 'react';
import { useState } from 'react';
import { useDeleteRepresentative, useGetRepresentativesPageByAccountId } from '../../api/RepresentativeApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, { IColumnType } from '../../components/table/Table';
import { Representative } from '../../entities/representative';
import { AuthService } from '../../services/AuthService';
import { TokenService } from '../../services/TokenService';
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

const mapRepresentativeToTableRow = (representative: Representative): IRepresentativeData => {
    const { facility, organizationRole } = representative;
        
    return {
        id: representative.id,
        firstname: representative.firstname,
        lastname: representative.lastname,
        email: 'unknown',
        organizationRole: organizationRole?.name,
        facility: facility?.name
    };
}

const RepresentativeTable: React.FunctionComponent<IRepresentativeTableProps> = (props) => {
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [representative, setRepresentative] = useState<Representative>();

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [pageNumber, setPageNumber] = useState(0);

    const token = TokenService.decode(AuthService.getToken());
    const { data } = useGetRepresentativesPageByAccountId(token.id, pageNumber, rowsPerPage);

    const handleDelete = (data: Representative) => {
        setRepresentative(data);
        setOpenDeleteModal(true);
    }

    const mutationDelete = useDeleteRepresentative();

    const onDelete = async () => {
        try {
            await mutationDelete.mutateAsync(representative!.id);
        } catch (e) {
            // add push notification
            console.log(e);
        }
    }

    const handleEdit = (data: Representative) => {
        setRepresentative(data);
        setOpenEditForm(true);
    }

	return (
        <>
            {data
                ?    <Table
                        columns={columns}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        mapModelToTableRow={mapRepresentativeToTableRow}
                        page={data} 
                        onPageChange={(_, page) => setPageNumber(page)} 
                        onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)} />
                :   <SkeletonTable 
                        columns={columns} 
                        rowsPerPage={rowsPerPage} />
            }

            <RepresentativeForm 
                open={openEditForm} 
                onClose={() => setOpenEditForm(false)}
                representative={representative} />    
            <DeleteModal 
                open={openDeleteModal} 
                onClose={() => setOpenDeleteModal(false)} 
                onDelete={onDelete} />
        </>
  	);
};

export default RepresentativeTable;
