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
import FacilityStatus from './components/FacilityStatus';

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

    const facilityContent = React.useMemo(() => {
        if (!!data) {
            return data.content.flatMap(organization => organization.facilities)
        } else {
            return [];
        }
    }, [data]);


    const facilityPage = {
        ...data!,
        content: facilityContent
    }
    
    const [selectedAll, setSelectedAll] = React.useState(false);
    const [checkedOrganizations, setCheckedOrganizations] = React.useState<Map<string, boolean>>();
    const [checkedFacilities, setCheckedFacilities] = React.useState<Map<string, boolean>>();

    React.useEffect(() => {
        const checkedF = new Map<string, boolean>(
            facilityContent.map((facility) => [facility.id, false])
        )
        setCheckedFacilities(checkedF)

        const organizations = data?.content ?? [];
        const checkedO = new Map<string, boolean>(
            organizations.map((organization) => [organization.id, false])
        )
        setCheckedOrganizations(checkedO);
    }, [isSuccess, data]);


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


    const handleFacilityCheckClick = (facility: Facility) => {
        // setCheckedFacilities(() => )
        // checkedFacilities
        // setCheckedFacilities()
    }

    const handleOrganizaitonsCheckClick = () => {

    }

    const handleAllCheckClick = () => {

    }

    const columns = getColumns(
        () => setOpenProposalModal(true),
        handleEdit,
        handleDelete,
        handleFacilityCheckClick,
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
    onSelect: (facility: Facility) => void,
    account: Account
): IColumnType<Facility>[] {
    const accountType = TokenService.getCurrentAccountType();
    const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
    const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''

    return [
        {
            key: '',
            title: <Checkbox />,
            minWidth: 10,
            render: facility => <Checkbox onClick={() => onSelect(facility)} />
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
            render: facility => facility.name
        },
        {
            key: 'city',
            title: 'City',
            minWidth: 150,
            render: (facility) => facility.address?.city.name
        },
        {
            key: 'address',
            title: 'Address',
            minWidth: 150,
            render: (facility) => facility.address?.name
        },
        {
            key: 'status',
            title: 'Status',
            minWidth: 150,
            render: (facility) => {
                return <FacilityStatus facility={facility} />
            }
        }
    ];
}

export default ArtistOrganizationsTable;
