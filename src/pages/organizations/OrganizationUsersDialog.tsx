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

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
}

const OrganizationUsersDialog = ({open, onClose}: IOrganizationFacilitiesDialogProps) => {
    const matches = useParams();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);
    const [totalElements, setTotalElements] = useState(0)

    useEffect(() => {
        axiosApi.get(`${USER_SERVICE}/accounts/organizations/${matches.id}`, {
            params: {
                page: pageNumber,
                size: rowsPerPage,
            }
        }).then(response => {
            setAccounts(response.data.content)
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
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell component="th" scope="row">
                                        {account.firstName} {account.lastName}
                                    </TableCell>
                                    <TableCell>{account.email}</TableCell>
                                    <TableCell>
                                        {PrepareDataUtil.convertFirstLatterToUpperCase(
                                                account.metadata.find(item => item.key === "organizationRole")!.value)}
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

export default OrganizationUsersDialog;
