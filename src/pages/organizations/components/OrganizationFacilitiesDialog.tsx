import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton} from "@mui/material";
import {IPage} from "../../../hooks/react-query";
import {ART_SERVICE, axiosApi} from "../../../http/axios";
import {useNavigate, useParams} from "react-router-dom";
import {Facility} from "../../../entities/facility";
import SkeletonTable from "../../../components/table/SkeletonTable";
import Table, {IColumnType} from '../../../components/table/Table';
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import {DeleteOutline} from "@mui/icons-material";

interface IOrganizationFacilitiesDialogProps {
    open: boolean;
    onClose: () => void;
    organizationId: string;
}

const OrganizationFacilitiesDialog = ({open, onClose, organizationId}: IOrganizationFacilitiesDialogProps) => {
    const navigate = useNavigate()
    const matches = useParams();

    const [facilities, setFacilities] = useState<IPage<Facility>>();
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    useEffect(() => {
        if (open) {
            axiosApi.get(`${ART_SERVICE}/facilities/organizations/${organizationId}`, {
                params: {
                    page: pageNumber,
                    size: rowsPerPage,
                }
            }).then(response => {
                console.log(response.data.content)
                setFacilities(response.data)
            })
        }
    }, [rowsPerPage, pageNumber, open])


    //@TODO CHANGE LATER
    const handleDelete = async (data: Facility) => {
        alert(data.name)
    }

    const handleEdit = (data: Facility) => {
        navigate(`/facilities/${data.id}`)
    }

    const columns = getColumns(
        handleEdit,
        handleDelete,
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"lg"} fullWidth>
            <DialogTitle>Organization's facilities</DialogTitle>
            <Divider/>
            <DialogContent>
                {facilities && facilities.content
                    ? <Table
                        columns={columns}
                        page={facilities}
                        onPageChange={setPageNumber}
                        onRowsPerPageChange={setRowsPerPage}
                    />
                    : <SkeletonTable
                        columns={columns}
                        rowsPerPage={rowsPerPage}/>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant={"contained"}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

function getColumns(onEdit: (data: Facility) => void, onDelete: (data: Facility) => void): IColumnType<Facility>[] {
    return [
        {
            key: 'name',
            title: 'Name',
            minWidth: 150
        },
        {
            key: 'address',
            title: 'Address',
            minWidth: 150,
            render: (facility) => {
                return (<span>{facility.address?.name}</span>)
            }
        },
        {
            key: 'isActive',
            title: 'isActive',
            minWidth: 150,
            render: (facility) => {
                return (
                    <span>{facility.isActive ? 'Active' : 'Inactive'}</span>
                )
            }
        },
        {
            key: 'actions',
            title: 'Actions',
            minWidth: 150,
            render: (organization) => {

                return (
                    <div>
                        <IconButton
                            disableRipple
                            aria-label='edit'
                            onClick={() => onEdit(organization)}
                        >
                            <ModeOutlinedIcon/>
                        </IconButton>
                        <IconButton
                            disableRipple
                            aria-label='delete'
                            onClick={() => onDelete(organization)}
                        >
                            <DeleteOutline/>
                        </IconButton>
                        {' '}
                    </div>
                )
            }
        }
    ];
}

export default OrganizationFacilitiesDialog;
