import * as React from 'react';
import {useGetArtists} from '../../api/ArtistApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Artist} from "../../entities/artist";


const columns: IColumnType<Artist>[] = [
    {
        key: 'firstName',
        title: 'First Name',
        minWidth: 150
    },
    {
        key: 'lastName',
        title: 'Last Name',
        minWidth: 150
    },
    {
        key: 'address',
        title: 'Address',
        minWidth: 150
    },
];


const ArtistsGrid = () => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [pageNumber, setPageNumber] = React.useState(0);

    const { data } = useGetArtists({page: pageNumber, size: rowsPerPage});


    const handleDelete = async (data: Artist) => {
        alert('delete artist')
    }


    const handleEdit = (data: Artist) => {
        alert('edit artist')
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

            <DeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={() => {}} />
        </>
    );
};

export default ArtistsGrid;