import {Proposal} from "../../../entities/proposal";
import Gallery from "../../arts/Gallery";

interface NewProposalArtProps {
    updateProposal: (proposal:Proposal[]) => void
    proposal: Proposal[]
}

export function NewProposalArt ({proposal, updateProposal}:NewProposalArtProps) {
    return <Gallery createNew={false} status={'exhibited'} onClick={(art) => {
        const props = [...proposal];
        props.forEach(p => {
            p.art = {...art};
            p.price = p.art.price;
        });
        updateProposal(props)
    }}/>;
}