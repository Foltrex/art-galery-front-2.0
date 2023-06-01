import * as React from 'react';
import {ChangeEvent, useState} from 'react';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Organization} from "../../entities/organization";
import {TokenService} from "../../services/TokenService";
import {OrganizationStatus} from "./components/OrganizationStatus";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {Button, FormControl, FormControlLabel, IconButton, Radio, RadioGroup} from "@mui/material";
import {Box} from "@mui/system";
import {Link, useNavigate} from "react-router-dom";
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {OrganizationRoleEnum} from "../../entities/enums/organizationRoleEnum";
import {Account} from "../../entities/account";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import Loading from "../../components/ui/Loading";
import {TypeFilter} from "../../components/form/TypeFilter";
import {useGetAllOrganizations} from "../../api/OrganizationApi";
import {getErrorMessage} from "../../components/error/ResponseError";


const Statuses: Array<{ label: string, value: string }> = [
    {label: 'All', value: ''},
    {label: 'Active', value: 'ACTIVE'},
    {label: 'Inactive', value: 'INACTIVE'},
];

const OrganizationGrid = () => {
    const navigate = useNavigate();
    const {authStore} = useRootStore();
    const account = authStore.account;

    
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    const [openProposalModal, setOpenProposalModal] = useState(false);

    const [status, setStatus] = useState(Statuses[0].value);
    const [searchText, setSearchText] = useState<string>();

    const {data} = useGetAllOrganizations({
        page: pageNumber,
        sort: 'name,asc',
        size: rowsPerPage,
        name: searchText,
        status: status,
    }, (error) => getErrorMessage("Failed to load organizations list", error));

    const handleChangeSearchFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.value);
    }

    if (account === undefined) {
        return <Loading/>
    }

    const handleDelete = async (data: Organization) => {
        alert(data.name)
    }

    const handleEdit = (data: Organization) => {
        navigate(`${data.id}`)
    }

    const columns = getColumns(
        () => setOpenProposalModal(true),
        handleEdit,
        handleDelete,
        account);

    return (
        <>
            <Box sx={{display: 'flex', gap: '20px'}}>
                <FormControl>
                    <TypeFilter onChange={(text) => setSearchText(text)} placeholder={`Search by name...`}/>
                </FormControl>
                <FormControl>
                    <RadioGroup
                        value={status}
                        onChange={handleChangeSearchFilter}
                        row
                    >
                        {Statuses.map(filter => (
                            <FormControlLabel
                                key={filter.value}
                                control={<Radio size='small'/>}
                                value={filter.value}
                                label={filter.label}/>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormControl style={{marginLeft: "auto"}}>
                    <Link to={"/organizations/new"}>
                        <Button variant="text" size={"large"}>New Organization</Button>
                    </Link>
                </FormControl>
            </Box>

            {data && data.content
                ? <Table
                    columns={columns}
                    page={data}
                    onPageChange={setPageNumber}
                    onRowsPerPageChange={setRowsPerPage}
                />
                : <SkeletonTable
                    columns={columns}
                    rowsPerPage={rowsPerPage}/>
            }

        </>
    );
};

function getColumns(setOpenProposalModal: () => void,
                    onEdit: (data: Organization) => void,
                    onDelete: (data: Organization) => void,
                    account: Account): IColumnType<Organization>[] {
    const accountType = TokenService.getCurrentAccountType();
    const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
    const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''

    return [
        {
            key: 'name',
            title: 'Name',
            minWidth: 150
        },
        {
            key: 'city',
            title: 'City',
            minWidth: 150,
            render: (organization) => organization?.address?.city?.name
        },
        {
            key: 'address',
            title: 'Address',
            minWidth: 150,
            render: (organization) => organization?.address?.name
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
            key: 'actions',
            title: 'Actions',
            minWidth: 150,
            render: (organization) => {
                if (accountType === AccountEnum.SYSTEM ||
                    (organizationId === organization.id && organizationRole === OrganizationRoleEnum.CREATOR)) {
                    return (
                        <div>
                            <IconButton
                                disableRipple
                                aria-label='edit'
                                onClick={() => onEdit(organization)}
                            >
                                <ModeOutlinedIcon/>
                            </IconButton>
                        </div>
                    )
                }
            }
        }
    ];
}

export default OrganizationGrid;
