import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Step as StepComponent,
    StepLabel,
    Stepper
} from "@mui/material";
import {Proposal} from "../../entities/proposal";
import {NewProposalFacility} from "./compontents/NewProposalFacility";
import {useMemo} from "react";
import {NewProposalConfiguration} from "./compontents/NewProposalConfiguration";
import {NewProposalArt} from "./compontents/NewProposalArt";
import Bubble from "../../components/bubble/Bubble";
import {createNewProp} from "./ProposalUtils";
import {useRootStore} from "../../stores/provider/RootStoreProvider";
import {find} from "../../util/MetadataUtil";
import {MetadataEnum} from "../../entities/enums/MetadataEnum";
import {useCreateProposal} from "../../api/ProposalApi";
import {getErrorMessage} from "../../components/error/ResponseError";
import {Facility} from "../../entities/facility";
import {Organization} from "../../entities/organization";

type Step = 'cancel'|'nothing'|'facility'|'art'|'configuration'

interface NewProposalDialogProps {
    step: Step
    next: (currentStep:Step, proposal:Proposal[]) => void
    back: () => void
    proposal: Proposal[]
    allowBack: boolean
}

export function NewProposalDialog ({step, next, proposal, back, allowBack}:NewProposalDialogProps) {
    const {authStore} = useRootStore();
    const createProposal = useCreateProposal((e) => {
        getErrorMessage("Failed to create new proposal", e);
    });

    const activeStep = useMemo(() => {
        if(step === "art") {
            return 0;
        } else if(step === "facility") {
            return 1;
        } else {
            return 2;
        }
    }, [step])

    return <Dialog open={true}  fullWidth
                   maxWidth="lg" /*fullScreen={step === 'facility' || step === 'art'} */onClose={() => next('cancel', [])}>
        <DialogTitle>
            New commercial proposal
            <Stepper activeStep={activeStep}>
                <StepComponent completed={step === 'facility' || step === "configuration"} >
                    <StepLabel>Select art</StepLabel>
                </StepComponent>
                <StepComponent completed={step === "configuration"} >
                    <StepLabel>Select organization</StepLabel>
                </StepComponent>
                <StepComponent completed={false} >
                    <StepLabel>Define compensation</StepLabel>
                </StepComponent>
            </Stepper>

        </DialogTitle>
        <DialogContent>
            <Box className={step === "art" ? '' : 'hidden'}>
                <NewProposalArt proposal={proposal} updateProposal={(proposal) => next('art', proposal)}/>
            </Box>

            <Box className={step === "facility" ? '' : 'hidden'}>
                <NewProposalFacility proposal={proposal} updateProposal={(prop) => {
                    if(prop.length === 0) {
                        const root = {...proposal[0]};
                        const account = authStore.account;
                        const reset = createNewProp(account)
                            .facilities([(({id: find(MetadataEnum.FACILITY_ID, account)} as any) as Facility)])
                            .organization(({id: find(MetadataEnum.ORGANIZATION_ID, account)}) as Organization)
                            .build()

                        root.facilities = reset.facilities;
                        root.organization = reset.organization;
                        next("nothing", [root]);
                    } else {
                        next('nothing', prop);
                    }
                }}/>
            </Box>
            <Box className={step === "configuration" ? '' : 'hidden'}>
                <NewProposalConfiguration proposal={proposal} updateProposal={(proposal) => {

                    next('nothing', proposal)
                }}/>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button variant={"outlined"}
                    color={"error"}
                    onClick={() => next("cancel", [])}>Cancel</Button>
            {allowBack && <Button variant={"outlined"}
                    color={"primary"}
                    onClick={() => back()}>Back</Button>}
            {step === 'facility' && <Button
                variant={"outlined"}
                color={"primary"}
                onClick={() => {
                    const facility = proposal[0].facilities[0];
                    if(!facility || !facility.id) {
                        Bubble.info("Please select at least one facility");
                        return;
                    }
                    next("facility", proposal)
                }}>Next</Button>}
            {step === 'configuration' && <Button
                variant={"outlined"}
                color={"primary"}
                onClick={() => {
                    Promise.all(proposal.map(p => createProposal.mutateAsync(p))).then(() => {
                        next('cancel', []);
                    })
                }}>Create commercial proposal</Button>}
        </DialogActions>
    </Dialog>
}