import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
import {IPage} from "../../hooks/react-query";
import {Organization} from "../../entities/organization";
import {ART_SERVICE, axiosApi, USER_SERVICE} from "../../http/axios";
import {useParams} from "react-router-dom";
import {Account} from "../../entities/account";
import Paper from "@mui/material/Paper";
import {PrepareDataUtil} from "../../util/PrepareDataUtil";
import {Facility} from "../../entities/facility";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
}

const OrganizationFacilitiesDialog = ({open, onClose}: IOrganizationFacilitiesDialogProps) => {
    const matches = useParams();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);
    const [totalElements, setTotalElements] = useState(0)

    useEffect(() => {
        axiosApi.get(`${ART_SERVICE}/facilities/organizations/${matches.id}`, {
            params: {
                page: pageNumber,
                size: rowsPerPage,
            }
        }).then(response => {
            console.log(response.data.content)
            setFacilities(response.data.content)
            setTotalElements(response.data.totalElements)
        })
    }, [rowsPerPage, pageNumber])

    const handleChangePage = (event: unknown, newPage: number) => {
        setPageNumber(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPageNumber(0);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"md"} fullWidth>
            <DialogTitle>Organization's participants</DialogTitle>
            <Divider/>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table aria-label="users table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>isActive</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {facilities.map((facility) => (
                                <TableRow key={facility.id}>
                                    <TableCell component="th" scope="row">
                                        {facility.name}
                                    </TableCell>
                                    <TableCell>{facility.address?.name}</TableCell>
                                    <TableCell>
                                        {facility.isActive ? 'Active' : 'Inactive'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[1, 5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={pageNumber}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrganizationFacilitiesDialog;
