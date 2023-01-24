import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Facility } from '../../entities/facility';
import { TFacilityPageProps } from '../../pages/facilities';
import { FacilityService } from '../../services/FacilityService';
import FacilityForm from '../forms/FacilityForm';
import DeleteModal from '../modals/DeleteModal';
import rootStore from "../../stores/rootStore";

const FacilityTable: React.FC<TFacilityPageProps> = observer(({
    facilities, 
    pageNumber, 
    pageSize, 
    organizations, 
    cities
}) => {
    
    const columns = [
        {id: 'number', label: '#', minWidth: 5, align: "center"},
        {id: 'name', label: 'Name', minWidth: 150, align: "center"},
        {id: 'isActive', label: 'Activity', minWidth: 150, align: "center"},
        {id: 'address', label: 'Address', minWidth: 150, align: "center"},
        {id: 'organization', label: 'Organization', minWidth: 150, align: "center"},
        {id: 'action', label: 'Action', minWidth: 150, align: "center"}
    ];
    
    
    const router = useRouter();

    const [currentFacility, setCurrentFacility] = useState<Facility>();

    const [openEditFacilityModal, setOpenEditFacilityModal] = useState(false);
    const [openDeleteFacilityModal, setOpenDeleteFacilityModal] = useState(false);

    const handleOpenEditFacilityModalClick = (facility: Facility) => {
        setCurrentFacility(facility);
        setOpenEditFacilityModal(true);
    }

    const handleCloseEditFacilityModalClick = () => {
        setOpenEditFacilityModal(false);
        router.replace(router.asPath);
    }

    const handleOpenDeleteFacilityModalClick = (facility: Facility) => {
        setCurrentFacility(facility);
        setOpenDeleteFacilityModal(true);
    }

    const handleCloseDeleteFacilityModalClick = () => {
        setOpenDeleteFacilityModal(false);
        router.replace(router.asPath);
    }

    const { facilityStore, organizationStore, cityStore } = rootStore;


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
                    {facilities.map((facility, index) => {
                        return (
                            <TableRow hover tabIndex={-1} key={index}>
                                <TableCell key='number' align='center'>
                                    {index + 1 + pageSize * pageNumber}
                                </TableCell>
                                <TableCell key='name' align='center'>{facility.name}</TableCell>
                                <TableCell key='isActive' align='center'>
                                    {facility.isActive ? 'Active' : 'Inactive' }
                                </TableCell>
                                <TableCell key='address' align='center'>
                                    {facility.address?.streetName}
                                </TableCell>
                                <TableCell key='organization' align='center'>
                                    {facility.organization?.name}
                                </TableCell>
                                <TableCell key='action' align='center'>
                                    <div>
                                        <Button
                                            style={{minWidth: "100px"}}
                                            variant="contained"
                                            onClick={() => handleOpenEditFacilityModalClick(facility)}
                                        >
                                            Edit
                                        </Button>
                                        {' '}
                                        <Button
                                            style={{minWidth: "100px"}}
                                            variant="contained"
                                            onClick={() => handleOpenDeleteFacilityModalClick(facility)}
                                        >
                                            remove
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <FacilityForm 
                        open={openEditFacilityModal} 
                        handleClose={handleCloseEditFacilityModalClick} 
                        facility={currentFacility!}
                        organizations={organizations}
                        cities={cities}/>
                    <DeleteModal
                        open={openDeleteFacilityModal}
                        handleClose={handleCloseDeleteFacilityModalClick}
                        id={currentFacility?.id!}
                        deleteById={(id) => FacilityService.deleteById(id)} />
                </TableBody>
            </Table>
        </TableContainer>);
});

export default FacilityTable;