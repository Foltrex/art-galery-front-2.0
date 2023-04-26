import {Box, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {TypeFilter} from '../../components/form/TypeFilter';
import {useGetAllOrganizations} from '../../api/OrganizationApi';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Organization} from '../../entities/organization';
import {Facility} from '../../entities/facility';
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
interface Selection {
    all: boolean,
    organizations:Record<string, boolean>,
    facilities:Record<string, boolean>,
}
function somethingSelected(selection: Selection) {
    if(selection.all) {
        return true;
    }
    for(let k in selection.facilities) {
        if(selection.facilities[k]) {
            return true;
        }
    }
    return false;
}

const ArtistOrganizationsTable = () => {
    const [selection, setSelection] = useState<Selection>({all:false, organizations:{}, facilities:{}})
    const [status, setStatus] = React.useState(Statuses[0].value);
    const [searchText, setSearchText] = React.useState<string>();
    const navigate = useNavigate();

    // const [showActiveFacilities, setShowActiveFacilities] = React.useState<boolean>();

    const [openProposalModal, setOpenProposalModal] = React.useState(false);

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    var { data, isSuccess, isLoading } = useGetAllOrganizations({
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

    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
    }

    const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.value);
    }

    useEffect(() => {
        if(somethingSelected(selection)) {
            setSelection({all: false, organizations: {}, facilities: {}})
        }
    }, [isLoading])

    const handleFacilityCheckClick = (updatedFacility: Facility) => {
        setSelection(facilityContent.reduce((selection, facility) => {
            if(!selection.facilities[facility.id]) {
                selection.all = false;
                if(facility.organizationId === updatedFacility.organizationId) {
                    selection.organizations[facility.organizationId as string] = false;
                }
            }
            return selection;
        }, {
            all: true,
            organizations: {
                ...selection.organizations,
                [updatedFacility.organizationId as string]: true
            },
            facilities: {
                ...selection.facilities,
                [updatedFacility.id]: !selection.facilities[updatedFacility.id]
            }
        } as Selection))
    }


    const handleOrganizaitonsCheckClick = (organizationId: string) => {
        setSelection(facilityContent.reduce((selection, facility) => {
            if(facility.organizationId === organizationId) {
                selection.facilities[facility.id] = selection.organizations[organizationId];
            }
            if(!selection.facilities[facility.id]) {
                selection.all = false;
            }
            return selection;
        }, {
            all: true,
            organizations: {
                ...selection.organizations,
                [organizationId]: !selection.organizations[organizationId]
            },
            facilities: {}
        } as Selection));
    }

    const handleAllCheckClick = () => {
        setSelection(facilityContent.reduce((selection, f) => {
            selection.facilities[f.id] = selection.all;
            selection.organizations[f.organizationId as string] = selection.all;
            return selection;
        }, {all: !selection.all, facilities: {}, organizations:{}} as Selection));
    }

    const handleProposeClick = () => {
        if (somethingSelected(selection)) {
            navigate('#');
        } else {
            Bubble.error('It is necessary to choose at least one facility');
        }
    }

    const columns = getColumns(
        () => setOpenProposalModal(true),
        handleAllCheckClick,
        handleOrganizaitonsCheckClick,
        handleFacilityCheckClick,
        selection
    );

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

function getColumns(
    setOpenProposalModal: () => void,
    onSelectAll: () => void,
    onSelectOrganization: (organizationId: string) => void,
    onSelectFacility: (facility: Facility) => void,
    selection: Selection,
): IColumnType<Facility>[] {
    console.log(selection);
    return [
        {
            key: '',
            title: <Checkbox checked={selection.all || false} onClick={onSelectAll}/>,
            minWidth: 10,
            render: facility => <Checkbox 
                checked={selection.facilities[facility.id] || false}
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
                            checked={selection.organizations[facility.organizationId as string] || false}
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
