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
import Bubble from '../../components/bubble/Bubble';

const Statuses: Array<{ label: string, value: string }> = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
];

type SelectedUnit = {
    id: string | number;
    selected: boolean;
}

const ArtistOrganizationsTable = () => {
    const navigate = useNavigate();
    const { authStore } = useRootStore();
    const account = authStore.account;

    const [status, setStatus] = React.useState(Statuses[0].value);
    const [searchText, setSearchText] = React.useState<string>();

    // const [showActiveFacilities, setShowActiveFacilities] = React.useState<boolean>();

    const [openProposalModal, setOpenProposalModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    var { data, isSuccess } = useGetAllOrganizations({
        page: pageNumber,
        sort: 'name,asc',
        size: rowsPerPage,
        name: searchText,
        status: 'ACTIVE',
    });

    const facilityContent = React.useMemo(() => {
        if (!!data) {
            return data.content
                .flatMap(organization => organization.facilities)
                .filter(facility => {
                    switch (status) {
                        case 'ACTIVE':
                            return facility.isActive;
                        case 'INACTIVE':
                            return !facility.isActive;
                        default:
                            return true;
                    }
                })
        } else {
            return [];
        }
    }, [data, status]);


    const facilityPage = {
        ...data!,
        content: facilityContent
    }
    
    const [isAllSelected, setAllSelected] = React.useState(false);
    const [checkedFacilities, setCheckedFacilities] = React.useState<SelectedUnit[]>([]);
    const [checkedOrganizations, setCheckedOrganizations] = React.useState<SelectedUnit[]>([]);

    React.useEffect(() => {
        const checkedF = facilityContent.map((facility): SelectedUnit => ({
            id: facility.id,
            selected: false
        }));
        setCheckedFacilities(checkedF)

        const organizations = data?.content ?? [];
        const checkedO = organizations.map((organization): SelectedUnit => ({
            id: organization.id, 
            selected: false
        }))
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
        const currentSeletedFacility = checkedFacilities.find(f => f.id === facility.id)!;
        let newCheckedFacilities = checkedFacilities
            .filter(f => f.id !== facility.id);

        newCheckedFacilities.push({
            id: currentSeletedFacility.id,
            selected: !currentSeletedFacility.selected
        });
        setCheckedFacilities(newCheckedFacilities);
    }


    const handleOrganizaitonsCheckClick = (organizationId: string) => {
        const organizationFacilities: Facility[] = facilityContent.filter(facility => {
            return facility.organizationId === organizationId;
        })

        const currentSelectedOrganization = checkedOrganizations.find(o => o.id === organizationId)!;
        let newCheckedOrganizations = checkedOrganizations.filter(o => o.id !== organizationId);
        newCheckedOrganizations.push({
            id: currentSelectedOrganization.id,
            selected: !currentSelectedOrganization.selected
        })

        const currentSeletedOrganizationFacilities = checkedFacilities
            .filter(f => {
                return !!organizationFacilities.find(orgF => orgF.id === f.id);
            })
            .map(f => ({...f, selected: !currentSelectedOrganization.selected}));

        let newSelectedFacilities = checkedFacilities.filter(f => {
            return !currentSeletedOrganizationFacilities.find(orgF => f.id === orgF.id);
        });
        newSelectedFacilities.push(...currentSeletedOrganizationFacilities)
        

        setCheckedOrganizations(newCheckedOrganizations);
        setCheckedFacilities(newSelectedFacilities);
    }

    const handleAllCheckClick = () => {
        setAllSelected(!isAllSelected);

        const newCheckedFacilities = checkedFacilities.map(facility => ({
            ...facility,
            selected: !isAllSelected
        }));
        setCheckedFacilities(newCheckedFacilities);

        const newCheckedOrganizations = checkedOrganizations.map(organization => ({
            ...organization,
            selected: !isAllSelected
        }));
        setCheckedOrganizations(newCheckedOrganizations);
    }

    const handleProposeClick = () => {
        const hasSelectedFacilities = () => {
            return !!checkedFacilities.find(f => f.selected);
        }

        if (hasSelectedFacilities()) {
            navigate('#');
        } else {
            Bubble.error('It is necessary to choose at least one facility');
        }
    }

    const columns = getColumns(
        () => setOpenProposalModal(true),
        handleEdit,
        handleDelete,
        handleAllCheckClick,
        handleFacilityCheckClick,
        handleOrganizaitonsCheckClick,
        isAllSelected,
        checkedFacilities,
        checkedOrganizations,
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
                <FormControl>
                    <Link onClick={handleProposeClick} to={'#'}>
                        <Button variant="text" size={"large"}>
                            PROPOSE
                        </Button>
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
    onSelectAll: () => void,
    onSelectFacility: (facility: Facility) => void,
    onSelectOrganization: (organizationId: string) => void,
    isAllSelected: boolean,
    checkedFacilities: SelectedUnit[],
    checkedOrganizations: SelectedUnit[],
    account: Account
): IColumnType<Facility>[] {
    const accountType = TokenService.getCurrentAccountType();
    const organizationRole = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ROLE)?.value || ''
    const organizationId = account.metadata.find(item => item.key === MetadataEnum.ORGANIZATION_ID)?.value || ''
    
    const defineSelectedFacility = (facility: Facility): boolean => {
        const currentSelected = checkedFacilities.find(f => f.id === facility.id);
        return currentSelected?.selected ?? false;
    } 

    const defineSelectedOrganization = (facility: Facility): boolean => {
        const currentSelected = checkedOrganizations.find(o => o.id === facility.organizationId);
        return currentSelected?.selected ?? false;
    } 


    return [
        {
            key: '',
            title: <Checkbox checked={isAllSelected} onClick={onSelectAll}/>,
            minWidth: 10,
            render: facility => <Checkbox 
                checked={defineSelectedFacility(facility)}
                onClick={() => onSelectFacility(facility)} 
            />
        },
        {
            key: 'organizationId',
            title: 'Organization',
            render: (facility) => {
                return (
                    <>
                        {facility?.organizationName}
                        <Checkbox
                            checked={defineSelectedOrganization(facility)}
                            onClick={() => onSelectOrganization(facility.organizationId!)}
                        />
                    </>
                )
            },
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
