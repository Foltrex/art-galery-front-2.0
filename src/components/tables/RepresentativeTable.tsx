import { Button } from '@mui/material';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Representative } from '../../entities/representative';
import { TRepresentativePageProps } from "../../pages/representatives";
import { RepresentativeService } from '../../services/RepresentativeService';
import RepresentativeForm from '../forms/RepresentativeForm';
import DeleteModal from '../modals/DeleteModal';
import rootStore from "../../stores/rootStore";

const RepresentativeTable: React.FC<TRepresentativePageProps> = ({
    representatives, 
    pageNumber, 
    pageSize, 
    totalElements, 
    facilities
}) => {

    const columns = [
        {id: 'number', label: '#', minWidth: 5, align: "center"},
        {id: 'firstname', label: 'firstname', minWidth: 5, align: "center"},
        {id: 'lastname', label: 'lastname', minWidth: 5, align: "center"},
        {id: 'email', label: 'Email', minWidth: 150, align: "center"},
        {id: 'organizationRole', label: 'Role', minWidth: 150, align: "center"},
        {id: 'facility', label: 'Facility info', minWidth: 150, align: "center"},
        {id: 'action', label: 'Action', minWidth: 150, align: "center"}
    ];

    
    const router = useRouter();

    const [currentRepresentative, setCurrentRepresentative] = useState<Representative>();

    const [openEditRepresentativeModal, setOpenEditRepresentativeModal] = useState(false);
    const [openDeleteRepresentativeModal, setOpenDeleteRepresentativeModal] = useState(false);
    
    const handleOpenEditRepresentativeModalClick = (representative: Representative) => {
        setCurrentRepresentative(representative);
        setOpenEditRepresentativeModal(true);
    }

    const handleCloseEditRepresentativeModalClick = () => {
        setOpenEditRepresentativeModal(false);
        router.replace(router.asPath);
    }

    const handleOpenDeleteRepresentativeModalClick = (representative: Representative) => {
        setCurrentRepresentative(representative);
        setOpenDeleteRepresentativeModal(true);
    }

    const handleCloseDeleteRepresentativeModalClick = () => {
        setOpenDeleteRepresentativeModal(false);
        router.replace(router.asPath);
    }

    return (
        <TableContainer>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={"center"}
                                style={{minWidth: column.minWidth}}
                            >
                                <b>{column.label}</b>
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {representatives.map((representative, index) => {
                        const { firstname, lastname, organizationRole, facility } = representative;
                        return (
                            <TableRow hover tabIndex={-1} key={index}>
                                <TableCell align='center'>{index + 1 + pageSize * pageNumber}</TableCell>
                                <TableCell align='center'>{firstname}</TableCell>
                                <TableCell align='center'>{lastname}</TableCell>
                                <TableCell align='center'></TableCell>
                                <TableCell align='center'>{organizationRole.name}</TableCell>
                                <TableCell align='center'>{facility.name}</TableCell>
                                <TableCell align='center'>
                                    <div>
                                        <Button
                                            style={{minWidth: "100px"}}
                                            variant="contained"
                                            color={"success"}
                                            onClick={() => handleOpenEditRepresentativeModalClick(representative)}
                                        >
                                            Edit
                                        </Button>
                                        {' '}
                                        <Button
                                            style={{minWidth: "100px"}}
                                            variant="contained"
                                            color={"error"}
                                            onClick={() => handleOpenDeleteRepresentativeModalClick(representative)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                    )})}
                    <RepresentativeForm 
                        open={openEditRepresentativeModal} 
                        handleClose={handleCloseEditRepresentativeModalClick}
                        representative={currentRepresentative}
                        facilities={facilities} />
                    <DeleteModal
                        open={openDeleteRepresentativeModal}
                        handleClose={handleCloseDeleteRepresentativeModalClick}
                        id={currentRepresentative?.id!}
                        deleteById={(id) => RepresentativeService.deleteById(id)} />
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default RepresentativeTable;