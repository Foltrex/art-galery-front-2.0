import Table, {IColumnType} from "../table/Table";
import * as React from "react";
import {useState} from "react";
import {Account} from "../../entities/account";
import {useDeleteRepresentative} from "../../api/RepresentativeApi";
import SkeletonTable from "../table/SkeletonTable";
import RepresentativeForm from "../../pages/representatives/RepresentativeForm";
import DeleteModal from "../modal/DeleteModal";
import {useGetAll} from "../../api/AccountApi";

function renderName(a: Account) {
    const fn = a.firstName;
    const ln = a.lastName;
    return (fn ? fn : "") + (fn && ln ? " " + ln : "");
}

const columns:IColumnType<Account>[] = [
    {
        key: 'email',
        title: 'Email'
    },
    {
        key: 'name',
        title: 'Name',
        render: (a) => renderName(a)
    },
    {
        key: 'accountType',
        title: 'Account Type',
    }
];

export const UserGrid = () => {

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);
    const [representative, setRepresentative] = useState<Account>();
    const {data} = useGetAll({page: pageNumber, size: rowsPerPage});

    const mutationDelete = useDeleteRepresentative();
    const onDelete = async () => {
        try {
            await mutationDelete.mutateAsync(representative!.id);
        } catch (e) {
            // add push notification
            console.log(e);
        }
    }

    const [openEditForm, setOpenEditForm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDelete = (data: Account) => {
        setRepresentative(data);
        setOpenDeleteModal(true);
    }

    const handleEdit = (data: Account) => {
        setRepresentative(data);
        setOpenEditForm(true);
    }


    return  <>
        {data
            ?    <Table
                columns={columns}
                onDelete={handleDelete}
                onEdit={handleEdit}
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
}