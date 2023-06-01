import {Avatar, Badge, Button, Tab, Tabs} from '@mui/material';
import * as React from 'react';
import {useMemo, useState} from 'react';
import {useGetCount, useGetProposals} from '../../api/ProposalApi';
import {Proposal} from '../../entities/proposal';
import Table, {IColumnType} from "../../components/table/Table";
import {Art} from "../../entities/art";
import {buildImageUrl} from "../../util/PrepareDataUtil";
import {NewProposalDialog} from "./NewProposalDialog";
import {AccountEnum} from "../../entities/enums/AccountEnum";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {find} from "../../util/MetadataUtil";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {getErrorMessage} from "../../components/error/ResponseError";
import SkeletonTable from "../../components/table/SkeletonTable";
import {createNewProp} from "./ProposalUtils";
import {HandshakeOutlined} from "@mui/icons-material";
import {Facility} from "../../entities/facility";
import {Organization} from "../../entities/organization";

interface IRepresentativeProposalsProps {
}


const ProposalsGrid: React.FunctionComponent<IRepresentativeProposalsProps> = () => {
    const {authStore} = useRootStore();
    const account = authStore.account;
    const [tab, setTab] = useState(0);

    const organizationId = useMemo(() => account.accountType === AccountEnum.REPRESENTATIVE
        ? find(MetadataEnum.ORGANIZATION_ID, account)
        : null, [account]);
    const facilityId = useMemo(() => account.accountType === AccountEnum.REPRESENTATIVE
        ? find(MetadataEnum.FACILITY_ID, account)
        : null, [account]);
    const [proposal, setProposal] = useState([createNewProp(account)
        .facilities([(({id: facilityId} as any) as Facility)])
        .organization(({id: organizationId}) as Organization)
        .build()]);

    const [pageNumber, setPageNumber] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(25);
    const [step, setStep] = React.useState<'cancel' | 'art' | 'facility' | 'configuration'>('cancel');

    const filter = {
        page: pageNumber,
        size: pageSize,
        sort: 'status,asc',
        accountId: account.accountType === AccountEnum.ARTIST ? account.id : undefined,
        facilityId: facilityId || undefined,
        organizationId: organizationId || undefined,
    }


    const {data} = useGetProposals(filter, (e) => {
        getErrorMessage("Failed to load proposals list", e)
    });
    const {data: count} = useGetCount(filter, (e) => {
        getErrorMessage("Failed to load proposals count", e)
    });

    function updateTab(tabIndex:number) {
        if(tabIndex === tab) {
            return;
        }
        setTab(tabIndex);
        setPageNumber(0);
    }

    const columns: IColumnType<Proposal>[] = useMemo(() => [
        {
            key: 'art',
            title: 'Art',
            render: item => {
                return <Avatar src={item.art.files && item.art.files[0] && buildImageUrl(item.art.files[0].id!)}/>
            }
        }
    ], []);

    return (
        <>
            <Tabs value={tab} onChange={(e, v) => updateTab(v)} aria-label="basic tabs example">
                <Tab label={<Badge badgeContent={(data ? data.received.totalElements : 0)} color="error">
                    <span>Received&nbsp;&nbsp;</span>
                </Badge>}/>
                <Tab label={<Badge badgeContent={(data ? data.sent.totalElements : 0)} color="primary">
                    <span>Sent&nbsp;&nbsp;</span>
                </Badge>}/>
                <Tab label={<Badge badgeContent={(data ? data.approved.totalElements : 0)} color="success">
                    <span>Approved&nbsp;&nbsp;</span>
                </Badge>} />
                {(account.accountType === AccountEnum.ARTIST || account.accountType === AccountEnum.REPRESENTATIVE)
                    && <Button startIcon={<HandshakeOutlined/>}
                               style={{marginLeft: "auto"}}
                               variant={"text"}
                               onClick={() => setStep('art')}>Commercial proposal</Button>}
            </Tabs>
            {data
                ? <Table columns={columns}
                   onPageChange={setPageNumber}
                   onRowsPerPageChange={setPageSize}
                   page={tab === 0 ? data.received : (tab === 1 ? data.sent : data.received)}/>
                : <SkeletonTable columns={columns}/>}
            {step !== 'cancel' &&
                <NewProposalDialog proposal={proposal} step={step}
                                   allowBack={step !== 'art'}
                                   back={() => {
                                       if (step === 'facility') {
                                           setStep('art')
                                       } else if (step === 'configuration') {
                                           setStep('facility')
                                       }
                                   }}
                                   next={(currentStep, proposal) => {
                                       if (currentStep === "art") {
                                           setStep('facility');
                                       } else if (currentStep === 'facility') {
                                           setStep('configuration')
                                       } else if (currentStep === 'configuration') {
                                           setStep('cancel');
                                           proposal = [createNewProp(account)
                                               .facilities([(({id: facilityId} as any) as Facility)])
                                               .organization(({id: organizationId}) as Organization)
                                               .build()]
                                       } else if(currentStep === 'cancel') {
                                           setStep('cancel');
                                           proposal = [createNewProp(account)
                                               .facilities([(({id: facilityId} as any) as Facility)])
                                               .organization(({id: organizationId}) as Organization)
                                               .build()]
                                       }

                                       setProposal(proposal);
                                   }}/>}
        </>
    );
};

export default ProposalsGrid;
