import * as React from 'react';
import {useState} from 'react';
import {useGetAllOrganizations} from '../../api/OrganizationApi';
import DeleteModal from '../../components/modal/DeleteModal';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Organization} from "../../entities/organization";
import {IconButton, Tooltip} from "@mui/material";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import {TokenService} from "../../services/TokenService";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import ArtsDialog from "./ArtsDialog";
import {OrganizationStatus} from "./OrganizationStatus";


const OrganizationGrid = () => {

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [pageNumber, setPageNumber] = React.useState(0);

    const { data } = useGetAllOrganizations({page: pageNumber, size: rowsPerPage});


    const [openProposalModal, setOpenProposalModal] = useState(false);

    const handleDelete = async (data: Organization) => {
        alert('delete org')
    }

    const handleEdit = (data: Organization) => {
        alert('edit org')
    }

    const columns = getColumns(() => setOpenProposalModal(true));

    return (
        <>
            {data && data.content
                ? 	<Table
                    columns={columns}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    page={data}
                    onPageChange={(e, page) => setPageNumber(page)}
                    onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)} />
                : 	<SkeletonTable
                    columns={columns}
                    rowsPerPage={rowsPerPage} />
            }

            <ArtsDialog
                open={openProposalModal}
                onClose={() => setOpenProposalModal(false)}
            />

            <DeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onDelete={() => {}} />
        </>
    );
};

function getColumns(setOpenProposalModal:() => void):IColumnType<Organization>[] {
    const accountType = TokenService.getCurrentAccountType();
    return [
        {
            key: 'name',
            title: 'Name',
            minWidth: 150
        },
        {
            key: 'status',
            title: 'Status',
            minWidth: 150,
            render: (organization) => {
                return <OrganizationStatus organization={organization}/>
            }
        },
        {
            key: 'address',
            title: 'Address',
            minWidth: 150,
            render: (organization) => {
                const address = organization.address;
                const city = address?.city;
                return address ? (city ? city.name + ', ' : '') + address.fullName: '';
            }
        },
        {
            key: 'controls',
            title: '',
            render: (organization) => {
                if(accountType === AccountEnum.ARTIST) {
                    return <Tooltip title={'Propose'}>
                        <IconButton onClick={setOpenProposalModal}>
                            <AssignmentReturnedIcon/>
                        </IconButton>
                    </Tooltip>
                } else if(accountType === AccountEnum.SYSTEM || (accountType === AccountEnum.REPRESENTATIVE)) {
                    return <div>EDIT</div>
                } else {
                    return <div/>
                }
            }
        }
    ];
}

export default OrganizationGrid;
