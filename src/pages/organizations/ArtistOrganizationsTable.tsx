import { Box, FormControl, RadioGroup, FormControlLabel, Radio, Button, IconButton, Checkbox } from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TypeFilter } from '../../components/form/TypeFilter';
import { useGetAllOrganizations } from '../../api/OrganizationApi';
import SkeletonTable from '../../components/table/SkeletonTable';
import { useRootStore } from '../../stores/provider/RootStoreProvider';
import { DeleteOutline } from '@mui/icons-material';
import Table, { IColumnType } from '../../components/table/Table';
import { Account } from '../../entities/account';
import { AccountEnum } from '../../entities/enums/AccountEnum';
import { MetadataEnum } from '../../entities/enums/MetadataEnum';
import { OrganizationRoleEnum } from '../../entities/enums/organizationRoleEnum';
import { Organization } from '../../entities/organization';
import { TokenService } from '../../services/TokenService';
import ModeOutlinedIcon from "@mui/icons-material/ModeOutlined";
import { OrganizationStatus } from './components/OrganizationStatus';
import { Facility } from '../../entities/facility';
import { IPage } from '../../hooks/react-query';

const Statuses: Array<{ label: string, value: string }> = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
];

interface IArtistOrganizationsTableProps {
}

const ArtistOrganizationsTable: React.FunctionComponent<IArtistOrganizationsTableProps> = (props) => {
    const navigate = useNavigate();
    const { authStore } = useRootStore();
    const account = authStore.account;

    const [status, setStatus] = React.useState(Statuses[0].value);
    const [searchText, setSearchText] = React.useState<string>();

    const [openProposalModal, setOpenProposalModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    var { data, isSuccess } = useGetAllOrganizations({
        page: pageNumber,
        sort: 'name,asc',
        size: rowsPerPage,
        name: searchText,
        status: status,
    });

    const [selectedAll, setSelectedAll] = React.useState(false);
    const [checkedOrganizations, setCheckedOrganizations] = React.useState<{
        organizationId: string,
        selected: boolean
    }[]>();
    const [checkedFacilities, setCheckedFacilities] = React.useState<{
        facilitiyId: string,
        selected: boolean
    }[]>();

    React.useEffect(() => {
        if (isSuccess && data) {
            // const facilities = data.content.flatMap(organization => organization.facilities);
            // const checkedF = facilities.map(f => {
            //     facilitiyId: f.id;
            //     selected: false
            // })
            // setCheckedFacilities(checkedF)
        }
    }, [isSuccess, data]);

    var facilityContent: Facility[] = [];
    if (data?.content) {
        facilityContent = data.content.flatMap(organization => {
            const facilities = organization.facilities;
            // facilities.forEach(facility => facility.organization = organization);
            return facilities;
        })
    }

    const facilityPage = {
        ...data!,
        content: facilityContent
    }

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
    }

    const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.value);
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
            <Box
                sx={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center',
                    px: 2,
                    pt: 2
                }}
            >
                <FormControl>
                    <TypeFilter onChange={handleSearch} placeholder={`Facility name`} />
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
                                control={<Radio size='small' />}
                                value={filter.value}
                                label={filter.label} />
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormControl style={{ marginLeft: "auto" }}>
                    <Link to={"/organizations/new"}>
                        <Button variant="text" size={"large"}>New Organization</Button>
                    </Link>
                </FormControl>
            </Box>

            {data && data.content
                ? <Table
                    columns={columns}
                    page={facilityPage}
                    onPageChange={setPageNumber}
                    onRowsPerPageChange={setRowsPerPage}
                    groupBy={['organizationId']}
                />
                : <SkeletonTable
                    columns={columns}
                    rowsPerPage={rowsPerPage} />
            }
        </>
    );
};

function getColumns(setOpenProposalModal: () => void,
    onEdit: (data: Organization) => void,
    onDelete: (data: Organization) => void,
    account: Account): IColumnType<Facility>[] {
    const accountType = TokenService.getCurrentAccountType();
    const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
    const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''

    return [
        {
            key: '',
            title: <Checkbox />,
            minWidth: 10,
            render: () => <Checkbox />
        },
        {
            key: 'organizationId',
            title: 'Organization',
            render: (facility) => facility?.organizationName,
            minWidth: 50,
            groupBy: (facility) => facility.organizationId
        },
        {
            key: 'facility',
            title: 'Facilities',
            minWidth: 100,
            groupBy: organization => organization.id
        }
        // {
        //     key: 'city',
        //     title: 'City',
        //     minWidth: 150,
        //     render: (organization) => organization.facilities
        // },
        // {
        //     key: 'address',
        //     title: 'Address',
        //     minWidth: 150,
        //     render: (organization) => organization?.address?.name
        // },
        // {
        //     key: 'status',
        //     title: 'Status',
        //     minWidth: 150,
        //     render: (organization) => {
        //         return <OrganizationStatus organization={organization}/>
        //     }
        // },
        // {
        //     key: 'actions',
        //     title: 'Actions',
        //     minWidth: 150,
        //     render: (organization) => {
        //         if (accountType === AccountEnum.SYSTEM ||
        //             (organizationId === organization.id && organizationRole === OrganizationRoleEnum.CREATOR)) {
        //             return (
        //                 <div>
        //                     <IconButton
        //                         disableRipple
        //                         aria-label='edit'
        //                         onClick={() => onEdit(organization)}
        //                     >
        //                         <ModeOutlinedIcon/>
        //                     </IconButton>
        //                     <IconButton
        //                         disableRipple
        //                         aria-label='delete'
        //                         onClick={() => onDelete(organization)}
        //                     >
        //                         <DeleteOutline/>
        //                     </IconButton>
        //                     {' '}
        //                 </div>
        //             )
        //         }
        //     }
        // }
        // {
        //     key: 'address',
        //     title: 'Address',
        //     minWidth: 150,
        //     render: (organization) => {
        //         const address = organization.address;
        //         const city = address?.city;
        //         return address ? (city ? city.name + ', ' : '') + address.fullName: '';
        //     }
        // },
        // {
        //     key: 'controls',
        //     title: '',
        //     render: (organization) => {
        //         if(accountType === AccountEnum.ARTIST) {
        //             return <Tooltip title={'Propose'}>
        //                 <IconButton onClick={setOpenProposalModal}>
        //                     <AssignmentReturnedIcon/>
        //                 </IconButton>
        //             </Tooltip>
        //         } else if(accountType === AccountEnum.SYSTEM || (accountType === AccountEnum.REPRESENTATIVE)) {
        //             return <div>EDIT</div>
        //         } else {
        //             return <div/>
        //         }
        //     }
        // }
    ];
}

export default ArtistOrganizationsTable;
