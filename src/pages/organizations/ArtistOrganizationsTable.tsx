import {Box, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material';
import * as React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {TypeFilter} from '../../components/form/TypeFilter';
import {useGetAllOrganizations} from '../../api/OrganizationApi';
import SkeletonTable from '../../components/table/SkeletonTable';
import Table, {IColumnType} from '../../components/table/Table';
import {Organization} from '../../entities/organization';
import {Facility} from '../../entities/facility';
import FacilityStatus from './components/FacilityStatus';
import Bubble from '../../components/bubble/Bubble';
import {getErrorMessage} from "../../components/error/ResponseError";
import {HandshakeOutlined} from "@mui/icons-material";
import {createNewProp} from "../proposals/ProposalUtils";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {NewProposalDialog} from "../proposals/NewProposalDialog";
import {Proposal} from "../../entities/proposal";


const Statuses: Array<{ label: string, value: string }> = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
];

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


const ArtistOrganizationsTable = ({allowProposal, onSelectionChange}:{
    allowProposal:boolean,
    onSelectionChange?: (facilities:Facility[], total:Organization[]) => void
}) => {
    const [selection, updateSelection] = useState<Selection>({all:false, organizations:{}, facilities:{}})
    const [status, setStatus] = React.useState(Statuses[0].value);
    const [searchText, setSearchText] = React.useState<string>();
    const navigate = useNavigate();
    const { authStore } = useRootStore();
    const account = authStore.account;
    const [step, setStep] = React.useState<'cancel' | 'art' | 'configuration'>('cancel');
    const [proposal, setProposal] = useState<Proposal[]>([]);
    function updatePageNumber(pageNumber:number) {
        setPageNumber(pageNumber);
        reset();
    }
    function updateRowsPerPage(pageSize:number) {
        setRowsPerPage(pageNumber);
        reset();
    }
    const handleSearch = (searchText: string) => {
        setSearchText(searchText);
        reset();
    }

    function reset() {
        setSelection({
            all: false,
            organizations: {},
            facilities: {}
        });
        setProposal([]);
    }

    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [pageNumber, setPageNumber] = React.useState(0);

    var { data, isSuccess, isLoading } = useGetAllOrganizations({
        page: pageNumber,
        sort: 'name,asc',
        size: rowsPerPage,
        name: searchText,
        status: 'ACTIVE',
    }, (error) => {
        getErrorMessage("Failed to load organizations", error);
    });

    function setSelection(selection:Selection) {
        updateSelection(selection);

        const propdata = [];
        const organizations = data?.content.reduce((prev, org) => {
            prev[org.id] = org;
            return prev;
        }, {} as Record<string, Organization>) || {}
        for(let orgId in selection.organizations) {
            const organization = organizations[orgId];
            const facilities = organization.facilities.filter(f => selection.facilities[f.id]);
            if(facilities.length) {
                propdata.push(createNewProp(account)
                    .organization(organization)
                    .facilities(facilities)
                    .build());
            }
        }
        setProposal(propdata);
        if(!!data && onSelectionChange) {
            onSelectionChange(
                data.content
                    .flatMap(organization => organization.facilities)
                    .filter(f => selection.facilities[f.id!]),
                data.content
            );
        }
    }

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

    const facilitiesCounter = useMemo(() => {
        const out:Record<string, number> = {}
        facilityContent.forEach(f => {
            if(!out[f.organizationId!]) {
                out[f.organizationId!] = 0;
            }
            out[f.organizationId!]++;
        })
        return out;
    }, [facilityContent]);

    const facilityPage = {
        ...data!,
        content: facilityContent
    }

    const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.value);
    }

    useEffect(() => {
        if (isLoading && somethingSelected(selection)) {
            setSelection({all: false, organizations: {}, facilities: {}})
        }
    }, [isLoading, selection])

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
            facilities: {...selection.facilities}
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
            setStep("art")
        } else {
            Bubble.error('It is necessary to choose at least one facility');
        }
    }

    const columns = getColumns(
        handleAllCheckClick,
        handleOrganizaitonsCheckClick,
        handleFacilityCheckClick,
        selection,
        facilitiesCounter
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
                {allowProposal && <FormControl style={{ marginLeft: "auto" }}>
                    <Button variant="outlined" size={"large"} color={"primary"} startIcon={<HandshakeOutlined/>} onClick={handleProposeClick}>
                        Commercial proposal
                    </Button>
                </FormControl>}
            </Box>

            {data && data.content
                ? <Table
                    columns={columns}
                    page={facilityPage}
                    onPageChange={updatePageNumber}
                    onRowsPerPageChange={updateRowsPerPage}
                    groupBy={['organizationId']}
                />
                : <SkeletonTable
                    columns={columns}
                    rowsPerPage={rowsPerPage} />
            }
            {step !== 'cancel' &&
                <NewProposalDialog proposal={proposal} step={step}
                                   allowBack={step !== "art"}
                                   back={() => {
                                       if (step === 'configuration') {
                                           setStep('art')
                                       }
                                   }}
                                   next={(currentStep, proposal) => {
                                       if (currentStep === 'art') {
                                           setStep('configuration')
                                           setProposal(proposal);
                                       } else if (currentStep === 'configuration') {
                                           setStep('cancel');
                                           reset();
                                       } else if(currentStep === 'cancel') {
                                           setStep('cancel');
                                           reset();
                                       }
                                   }}/>}
        </>
    );
};

function getColumns(
    onSelectAll: () => void,
    onSelectOrganization: (organizationId: string) => void,
    onSelectFacility: (facility: Facility) => void,
    selection: Selection,
    facilitiesCounter: Record<string, number>,
): IColumnType<Facility>[] {
    return [
        {
            key: 'organizationId',
            title: <FormControlLabel control={
                <Checkbox checked={selection.all || false} onClick={onSelectAll}/>} label={'Select all'} />,
            render: (facility) => {
                const count = facilitiesCounter[facility.organizationId!];
                return (
                    <FormControlLabel control={
                        <Checkbox checked={selection.organizations[facility.organizationId as string] || false}
                                  onClick={() => onSelectOrganization(facility.organizationId!)}
                    />} label={facility?.organizationName + (count > 1 ? ' (' + count + ')' : '')} />
                )
            },
            textAlign: 'left',
            minWidth: 50,
            groupBy: (facility) => facility.organizationId
        },
        {
            key: 'facility',
            title: 'Facilities',
            minWidth: 100,
            render: facility => {
                return (
                    <Box textAlign={"left"}>
                        <FormControlLabel control={
                                <Checkbox checked={selection.facilities[facility.id] || false}
                                          onClick={() => onSelectFacility(facility)}
                                />} label={facility?.name}/>
                    </Box>
                )
            }
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
