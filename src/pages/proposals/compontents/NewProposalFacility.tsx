import {Proposal} from "../../../entities/proposal";
import ArtistOrganizationsTable from "../../organizations/ArtistOrganizationsTable";
import * as React from "react";
import {Organization} from "../../../entities/organization";
import {Facility} from "../../../entities/facility";

interface NewProposalFacilityProps {
    updateProposal: (proposal:Proposal[]) => void
    proposal: Proposal[]
}

export function NewProposalFacility ({proposal, updateProposal}:NewProposalFacilityProps) {
    return <ArtistOrganizationsTable allowProposal={false} onSelectionChange={(selection, total) => {
        const out:Proposal[] = [];
        const organizationParticipants = selection.reduce((current, next) => {
            if(!current[next.organizationId!]) {
                current[next.organizationId!] = [];
            }
            current[next.organizationId!].push(next);
            return current;
        }, {} as Record<string, Facility[]>)

        const organizations = total
            .filter(o => organizationParticipants[o.id])
            .reduce((current, next) => {
                current[next.id] = next;
                return current;
            }, {} as Record<string, Organization>)

        const root = proposal[0];
        for(let organizationId in organizationParticipants) {
            const facilities = organizationParticipants[organizationId];
            const organization = organizations[organizationId];
            out.push({
                ...root,
                organization: organization,
                facilities: facilities
            })
        }
        updateProposal(out);
    }}/>;
}